import { SortField, SortDirection } from '../types'

interface FiltersProps {
  search: string
  setSearch: (v: string) => void
  selectedGenre: string
  setSelectedGenre: (v: string) => void
  selectedLanguage: string
  setSelectedLanguage: (v: string) => void
  selectedOwner: string
  setSelectedOwner: (v: string) => void
  selectedFormat: string
  setSelectedFormat: (v: string) => void
  readFilter: string
  setReadFilter: (v: '' | 'nora' | 'sara' | 'both' | 'unread') => void
  sortField: SortField
  setSortField: (v: SortField) => void
  sortDirection: SortDirection
  setSortDirection: (v: SortDirection) => void
  genres: string[]
  languages: string[]
  owners: string[]
  formats: string[]
  resultCount: number
  totalCount: number
  hasActiveFilters: boolean
  clearFilters: () => void
}

export function Filters({
  search, setSearch,
  selectedGenre, setSelectedGenre,
  selectedLanguage, setSelectedLanguage,
  selectedOwner, setSelectedOwner,
  selectedFormat, setSelectedFormat,
  readFilter, setReadFilter,
  sortField, setSortField,
  sortDirection, setSortDirection,
  genres, languages, owners, formats,
  resultCount, totalCount,
  hasActiveFilters, clearFilters
}: FiltersProps) {
  const selectClass = "bg-warm-white dark:bg-white/10 border border-sand dark:border-white/10 rounded-lg px-3 py-2.5 text-sm text-ink dark:text-[#e0dcd5] focus:outline-none focus:ring-2 focus:ring-leather/30 focus:border-leather appearance-none cursor-pointer"

  return (
    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-sand/60 dark:border-white/10 p-5 shadow-sm">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-light/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Søk etter tittel, forfatter eller notater..."
          className="w-full bg-warm-white dark:bg-white/10 border border-sand dark:border-white/10 rounded-lg pl-11 pr-4 py-3 text-sm text-ink dark:text-[#e0dcd5] placeholder:text-ink-light/40 dark:placeholder:text-[#666] focus:outline-none focus:ring-2 focus:ring-leather/30 focus:border-leather"
        />
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-3 mt-4">
        <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)} className={selectClass}>
          <option value="">Alle sjangre</option>
          {genres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)} className={selectClass}>
          <option value="">Alle språk</option>
          {languages.map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        <select value={selectedOwner} onChange={e => setSelectedOwner(e.target.value)} className={selectClass}>
          <option value="">Alle eiere</option>
          {owners.map(o => <option key={o} value={o}>{o}</option>)}
        </select>

        <select value={selectedFormat} onChange={e => setSelectedFormat(e.target.value)} className={selectClass}>
          <option value="">Alle formater</option>
          {formats.map(f => <option key={f} value={f}>{f}</option>)}
        </select>

        <select value={readFilter} onChange={e => setReadFilter(e.target.value as '' | 'nora' | 'sara' | 'both' | 'unread')} className={selectClass}>
          <option value="">Alle lesestatus</option>
          <option value="nora">Lest av Nora</option>
          <option value="sara">Lest av Sara</option>
          <option value="both">Lest av begge</option>
          <option value="unread">Ulest</option>
        </select>

        <div className="flex items-center gap-2 ml-auto">
          <select value={sortField} onChange={e => setSortField(e.target.value as SortField)} className={selectClass}>
            <option value="tittel">Sorter: Tittel</option>
            <option value="forfatter">Sorter: Forfatter</option>
            <option value="sjanger">Sorter: Sjanger</option>
            <option value="spraak">Sorter: Språk</option>
          </select>
          <button
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="bg-warm-white dark:bg-white/10 border border-sand dark:border-white/10 rounded-lg p-2.5 hover:bg-sand/40 dark:hover:bg-white/20 transition-colors"
            title={sortDirection === 'asc' ? 'Stigende' : 'Synkende'}
          >
            <svg className={`w-4 h-4 text-ink-light transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Result count & clear */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-sand/40 dark:border-white/10">
        <p className="text-sm text-ink-light dark:text-[#999]">
          Viser <span className="font-semibold text-ink dark:text-[#e0dcd5]">{resultCount}</span> av {totalCount} bøker
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-burgundy hover:text-burgundy/80 font-medium transition-colors"
          >
            Nullstill filtre
          </button>
        )}
      </div>
    </div>
  )
}
