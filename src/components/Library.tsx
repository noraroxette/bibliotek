import { useState, useMemo } from 'react'
import { Book, SortField, SortDirection } from '../types'
import { BookCard } from './BookCard'
import { BookTable } from './BookTable'
import { Filters } from './Filters'

interface LibraryProps {
  books: Book[]
  genres: string[]
  languages: string[]
  owners: string[]
  formats: string[]
}

export function Library({ books, genres, languages, owners, formats }: LibraryProps) {
  const [search, setSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [selectedOwner, setSelectedOwner] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('')
  const [readFilter, setReadFilter] = useState<'' | 'nora' | 'sara' | 'both' | 'unread'>('')
  const [sortField, setSortField] = useState<SortField>('tittel')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [listView, setListView] = useState<'grid' | 'table'>('grid')

  const filteredBooks = useMemo(() => {
    let result = books

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(b =>
        b.tittel.toLowerCase().includes(q) ||
        b.forfatter.toLowerCase().includes(q) ||
        b.notater.toLowerCase().includes(q)
      )
    }

    if (selectedGenre) {
      result = result.filter(b =>
        b.sjanger.split(',').map(g => g.trim()).includes(selectedGenre)
      )
    }

    if (selectedLanguage) {
      result = result.filter(b => b.spraak === selectedLanguage)
    }

    if (selectedOwner) {
      result = result.filter(b => b.eier === selectedOwner)
    }

    if (selectedFormat) {
      result = result.filter(b => b.eierform === selectedFormat)
    }

    if (readFilter === 'nora') {
      result = result.filter(b => b.lestNora)
    } else if (readFilter === 'sara') {
      result = result.filter(b => b.lestSara)
    } else if (readFilter === 'both') {
      result = result.filter(b => b.lestNora && b.lestSara)
    } else if (readFilter === 'unread') {
      result = result.filter(b => !b.lestNora && !b.lestSara)
    }

    result = [...result].sort((a, b) => {
      const aVal = a[sortField].toLowerCase()
      const bVal = b[sortField].toLowerCase()
      const cmp = aVal.localeCompare(bVal, 'nb')
      return sortDirection === 'asc' ? cmp : -cmp
    })

    return result
  }, [books, search, selectedGenre, selectedLanguage, selectedOwner, selectedFormat, readFilter, sortField, sortDirection])

  const clearFilters = () => {
    setSearch('')
    setSelectedGenre('')
    setSelectedLanguage('')
    setSelectedOwner('')
    setSelectedFormat('')
    setReadFilter('')
  }

  const hasActiveFilters = search || selectedGenre || selectedLanguage || selectedOwner || selectedFormat || readFilter

  return (
    <div className="mt-8">
      <Filters
        search={search}
        setSearch={setSearch}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        selectedOwner={selectedOwner}
        setSelectedOwner={setSelectedOwner}
        selectedFormat={selectedFormat}
        setSelectedFormat={setSelectedFormat}
        readFilter={readFilter}
        setReadFilter={setReadFilter}
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        genres={genres}
        languages={languages}
        owners={owners}
        formats={formats}
        resultCount={filteredBooks.length}
        totalCount={books.length}
        hasActiveFilters={!!hasActiveFilters}
        clearFilters={clearFilters}
      />

      <div className="flex justify-end mt-4">
        <div className="flex gap-1 bg-sand/20 dark:bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setListView('grid')}
            title="Rutenett"
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              listView === 'grid'
                ? 'bg-white dark:bg-white/15 text-ink dark:text-[#e0dcd5] shadow-sm'
                : 'text-ink-light/50 hover:text-ink-light dark:hover:text-[#999]'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setListView('table')}
            title="Tabell"
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              listView === 'table'
                ? 'bg-white dark:bg-white/15 text-ink dark:text-[#e0dcd5] shadow-sm'
                : 'text-ink-light/50 hover:text-ink-light dark:hover:text-[#999]'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-sand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="mt-4 text-ink-light text-lg">Ingen bøker funnet</p>
          <p className="text-ink-light/60 text-sm mt-1">Prøv å endre filtrene dine</p>
        </div>
      ) : listView === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredBooks.map((book, i) => (
            <BookCard key={`${book.tittel}-${book.forfatter}-${i}`} book={book} />
          ))}
        </div>
      ) : (
        <BookTable books={filteredBooks} />
      )}
    </div>
  )
}
