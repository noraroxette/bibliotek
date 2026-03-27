import { useState, useMemo, useEffect } from 'react'
import booksData from './data/books.json'
import { Book, ViewMode } from './types'
import { Library } from './components/Library'
import { Stats } from './components/Stats'
import { Header } from './components/Header'

const books: Book[] = booksData as Book[]

export default function App() {
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
        {view === 'library' ? (
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
