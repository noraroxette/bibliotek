import { useState, useMemo, useEffect } from 'react'
import fallbackData from './data/books.json'
import { Book, ViewMode } from './types'
import { Library } from './components/Library'
import { Stats } from './components/Stats'
import { Header } from './components/Header'

const SHEET_ID = '15G1_6-Aanx2-Tbn02z_Je2764Q6Zl0O0IvjwjPvr1k0'
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`

function parseCSV(csv: string): Book[] {
  const lines = csv.split('\n').filter(Boolean)
  return lines.slice(1).map(line => {
    const cols: string[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        inQuotes = !inQuotes
      } else if (ch === ',' && !inQuotes) {
        cols.push(current)
        current = ''
      } else {
        current += ch
      }
    }
    cols.push(current)
    if (!cols[0]?.trim()) return null
    return {
      tittel: cols[0]?.trim() ?? '',
      forfatter: cols[1]?.trim() ?? '',
      sjanger: cols[2]?.trim() ?? '',
      spraak: cols[3]?.trim() ?? '',
      eierform: cols[4]?.trim() ?? '',
      kjoept: cols[5]?.trim() ?? '',
      eier: cols[6]?.trim() ?? '',
      notater: cols[7]?.trim() ?? '',
      lestNora: cols[8]?.trim().toUpperCase() === 'TRUE',
      lestSara: cols[9]?.trim().toUpperCase() === 'TRUE',
    } as Book
  }).filter(Boolean) as Book[]
}

export default function App() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)
  const [view, setView] = useState<ViewMode>('stats')
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    fetch(SHEET_URL)
      .then(res => {
        if (!res.ok) throw new Error('not ok')
        return res.text()
      })
      .then(csv => {
        setBooks(parseCSV(csv))
        setLoading(false)
      })
      .catch(() => {
        setBooks(fallbackData as Book[])
        setUsingFallback(true)
        setLoading(false)
      })
  }, [])

  const uniqueGenres = useMemo(() => {
    const genres = new Set<string>()
    books.forEach(b => {
      b.sjanger.split(',').map(g => g.trim()).filter(Boolean).forEach(g => genres.add(g))
    })
    return Array.from(genres).sort()
  }, [])

  const uniqueLanguages = useMemo(() => {
    const langs = new Set<string>()
    books.forEach(b => { if (b.spraak) langs.add(b.spraak) })
    return Array.from(langs).sort()
  }, [])

  const uniqueOwners = useMemo(() => {
    const owners = new Set<string>()
    books.forEach(b => { if (b.eier) owners.add(b.eier) })
    return Array.from(owners).sort()
  }, [])

  const uniqueFormats = useMemo(() => {
    const formats = new Set<string>()
    books.forEach(b => { if (b.eierform) formats.add(b.eierform) })
    return Array.from(formats).sort()
  }, [])

  const uniqueAuthors = useMemo(() => {
    const authors = new Set<string>()
    books.forEach(b => { if (b.forfatter) authors.add(b.forfatter) })
    return authors.size
  }, [])

  return (
    <div className="min-h-screen bg-cream dark:bg-[#1a1a1a] transition-colors">
      <Header view={view} setView={setView} totalBooks={books.length} dark={dark} setDark={setDark} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 transition-colors">
        {usingFallback && (
          <div className="mt-4 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-lg px-3 py-2">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            Viser lokal kopi — kunne ikke koble til Google Sheets. Dataene er kanskje ikke oppdaterte.
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center py-32 text-ink-light">
            <svg className="w-6 h-6 animate-spin mr-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Laster bøker...
          </div>
        ) : view === 'library' ? (
          <Library
            books={books}
            genres={uniqueGenres}
            languages={uniqueLanguages}
            owners={uniqueOwners}
            formats={uniqueFormats}
          />
        ) : (
          <Stats books={books} uniqueAuthors={uniqueAuthors} />
        )}
      </main>
    </div>
  )
}
