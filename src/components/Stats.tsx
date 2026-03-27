import { useMemo, useState } from 'react'
import { Book } from '../types'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

const CHART_COLORS = [
  '#8b6f47', '#7d8c6e', '#3b4a6b', '#7a3b3b', '#c4a35a',
  '#6b5233', '#a3b091', '#5a4e3c', '#9b7cb8', '#e8dfd3',
  '#4a7c6f', '#b85c4a', '#6c8fb8', '#c9956b', '#8fa67a',
]

interface StatsProps {
  books: Book[]
  uniqueAuthors: number
}

export function Stats({ books, uniqueAuthors }: StatsProps) {
  const [excludedAuthors, setExcludedAuthors] = useState<Set<string>>(new Set())

  const stats = useMemo(() => {
    const genreMap = new Map<string, number>()
    const languageMap = new Map<string, number>()
    const ownerMap = new Map<string, number>()
    const formatMap = new Map<string, number>()
    const authorMap = new Map<string, number>()

    let readByNora = 0
    let readBySara = 0
    let readByBoth = 0
    let unread = 0

    books.forEach(b => {
      b.sjanger.split(',').map(g => g.trim()).filter(Boolean).forEach(g => {
        genreMap.set(g, (genreMap.get(g) || 0) + 1)
      })
      if (b.spraak) languageMap.set(b.spraak, (languageMap.get(b.spraak) || 0) + 1)
      const owner = b.eier || 'Ikke spesifisert'
      ownerMap.set(owner, (ownerMap.get(owner) || 0) + 1)
      if (b.eierform) formatMap.set(b.eierform, (formatMap.get(b.eierform) || 0) + 1)
      if (b.forfatter) authorMap.set(b.forfatter, (authorMap.get(b.forfatter) || 0) + 1)
      if (b.lestNora && b.lestSara) readByBoth++
      else if (b.lestNora) readByNora++
      else if (b.lestSara) readBySara++
      else unread++
    })

    const genreData = Array.from(genreMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    const languageData = Array.from(languageMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    const ownerData = Array.from(ownerMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    const formatData = Array.from(formatMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    const allTopAuthors = Array.from(authorMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 20)

    const readStatusData = [
      { name: 'Begge', value: readByBoth },
      { name: 'Nora', value: readByNora },
      { name: 'Sara', value: readBySara },
      { name: 'Ulest', value: unread },
    ]

    const totalReadNora = readByBoth + readByNora
    const totalReadSara = readByBoth + readBySara

    return {
      genreData, languageData, ownerData, formatData,
      allTopAuthors, readStatusData, totalReadNora, totalReadSara,
      readByBoth, unread
    }
  }, [books])

  const filteredAuthors = useMemo(() =>
    stats.allTopAuthors.filter(a => !excludedAuthors.has(a.name)).slice(0, 15),
    [stats.allTopAuthors, excludedAuthors]
  )

  const toggleAuthorExclusion = (name: string) => {
    setExcludedAuthors(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const readColors = ['#7d8c6e', '#3b4a6b', '#c4a35a', '#e8dfd3']

  return (
    <div className="mt-8 space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <SummaryCard
          label="Totalt bøker"
          value={books.length}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
          color="bg-leather/10 text-leather-dark dark:bg-leather/20 dark:text-[#c4a35a]"
        />
        <SummaryCard
          label="Lest av Nora"
          value={stats.totalReadNora}
          subtitle={`${Math.round(stats.totalReadNora / books.length * 100)}%`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
          color="bg-sage/15 text-sage dark:bg-sage/20"
        />
        <SummaryCard
          label="Lest av Sara"
          value={stats.totalReadSara}
          subtitle={`${Math.round(stats.totalReadSara / books.length * 100)}%`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
          color="bg-navy/10 text-navy dark:bg-navy/20 dark:text-[#7b9fd4]"
        />
        <SummaryCard
          label="Uleste"
          value={stats.unread}
          subtitle={`${Math.round(stats.unread / books.length * 100)}%`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="bg-sand/50 text-ink-light dark:bg-white/10 dark:text-[#999]"
        />
        <SummaryCard
          label="Forfattere"
          value={uniqueAuthors}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
          color="bg-burgundy/10 text-burgundy dark:bg-burgundy/20 dark:text-[#c87070]"
        />
      </div>

      {/* Charts Grid — Lesestatus smaller, Genre larger */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6">
        {/* Read Status Pie Chart */}
        <ChartCard title="Lesestatus">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.readStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
                label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {stats.readStatusData.map((_, i) => (
                  <Cell key={i} fill={readColors[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {stats.readStatusData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: readColors[i] }} />
                <span className="text-ink-light dark:text-[#999]">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Genre Bar Chart */}
        <ChartCard title="Bøker etter sjanger">
          <ResponsiveContainer width="100%" height={Math.max(300, stats.genreData.length * 28)}>
            <BarChart data={stats.genreData} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={140} />
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="value" fill="#8b6f47" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Språk, Format, Eier — 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChartCard title="Språk">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={stats.languageData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {stats.languageData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {stats.languageData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="text-ink-light dark:text-[#999]">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Format">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={stats.formatData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {stats.formatData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[(i + 1) % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {stats.formatData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[(i + 1) % CHART_COLORS.length] }} />
                <span className="text-ink-light dark:text-[#999]">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Eier">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={stats.ownerData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {stats.ownerData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[(i + 3) % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {stats.ownerData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[(i + 3) % CHART_COLORS.length] }} />
                <span className="text-ink-light dark:text-[#999]">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Top Authors — full width */}
      <ChartCard title="Flest bøker per forfatter (topp 15)">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={filteredAuthors} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={160} />
            <Tooltip content={<BarTooltip />} />
            <Bar dataKey="value" fill="#3b4a6b" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
        {/* Author exclusion controls */}
        <div className="mt-4 pt-3 border-t border-sand/30 dark:border-white/10">
          <p className="text-xs text-ink-light dark:text-[#888] mb-2">Klikk for å skjule/vise en forfatter:</p>
          <div className="flex flex-wrap gap-1.5">
            {stats.allTopAuthors.map(a => (
              <button
                key={a.name}
                onClick={() => toggleAuthorExclusion(a.name)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  excludedAuthors.has(a.name)
                    ? 'bg-sand/40 text-ink-light/50 border-sand/30 line-through dark:bg-white/5 dark:text-[#666] dark:border-white/10'
                    : 'bg-navy/10 text-navy border-navy/20 dark:bg-navy/20 dark:text-[#7b9fd4] dark:border-navy/30'
                }`}
              >
                {a.name} ({a.value})
              </button>
            ))}
          </div>
          {excludedAuthors.size > 0 && (
            <button
              onClick={() => setExcludedAuthors(new Set())}
              className="text-xs text-burgundy dark:text-[#c87070] hover:underline mt-2"
            >
              Vis alle
            </button>
          )}
        </div>
      </ChartCard>
    </div>
  )
}

function SummaryCard({ label, value, subtitle, icon, color }: {
  label: string
  value: number
  subtitle?: string
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-sand/50 dark:border-white/10 rounded-xl p-5">
      <div className={`inline-flex p-2.5 rounded-lg ${color} mb-3`}>
        {icon}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-ink dark:text-[#e0dcd5] font-serif">{value}</span>
        {subtitle && <span className="text-sm text-ink-light dark:text-[#999]">{subtitle}</span>}
      </div>
      <p className="text-sm text-ink-light dark:text-[#888] mt-1">{label}</p>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-sand/50 dark:border-white/10 rounded-xl p-6">
      <h3 className="font-serif text-lg font-semibold text-ink dark:text-[#e0dcd5] mb-4">{title}</h3>
      {children}
    </div>
  )
}

function BarTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-[#222] border border-sand/50 dark:border-white/15 rounded-lg px-3 py-2 shadow-md text-sm">
      <p className="font-medium text-ink dark:text-[#e0dcd5]">{label}</p>
      <p className="text-ink-light dark:text-[#999]">{payload[0].value}</p>
    </div>
  )
}
