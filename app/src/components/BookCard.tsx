import { useState } from 'react'
import { Book } from '../types'

const genreColors: Record<string, string> = {
  'Fantasy': 'bg-purple-100 text-purple-800',
  'Sci-Fi': 'bg-blue-100 text-blue-800',
  'Roman': 'bg-amber-100 text-amber-800',
  'Thriller': 'bg-red-100 text-red-800',
  'LGBTQ': 'bg-pink-100 text-pink-800',
  'Romance': 'bg-rose-100 text-rose-800',
  'Non-fiction': 'bg-emerald-100 text-emerald-800',
  'YA': 'bg-cyan-100 text-cyan-800',
  'Horror': 'bg-gray-200 text-gray-800',
  'Mystery': 'bg-indigo-100 text-indigo-800',
  'Historical (fiction)': 'bg-orange-100 text-orange-800',
  'Poems': 'bg-violet-100 text-violet-800',
  'Lyrikk': 'bg-violet-100 text-violet-800',
  'Krim': 'bg-red-100 text-red-800',
}

function getGenreColor(genre: string): string {
  return genreColors[genre] || 'bg-sand/60 text-ink-light'
}

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const [expanded, setExpanded] = useState(false)
  const genres = book.sjanger.split(',').map(g => g.trim()).filter(Boolean)

  const readByNora = book.lestNora
  const readBySara = book.lestSara

  return (
    <div
      className="group bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-sand/50 dark:border-white/10 rounded-xl p-5 hover:shadow-md hover:border-leather/20 dark:hover:border-white/20 transition-all cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-lg font-semibold text-ink dark:text-[#e0dcd5] leading-snug group-hover:text-leather-dark dark:group-hover:text-[#c4a35a] transition-colors">
            {book.tittel}
          </h3>
          <p className="text-sm text-ink-light dark:text-[#999] mt-1">
            {book.forfatter}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {book.eierform && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              book.eierform === 'Kindle' ? 'bg-navy/10 text-navy' : 'bg-leather/10 text-leather-dark'
            }`}>
              {book.eierform}
            </span>
          )}
        </div>
      </div>

      {/* Genres */}
      {genres.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {genres.map(g => (
            <span key={g} className={`text-xs px-2 py-0.5 rounded-full font-medium ${getGenreColor(g)}`}>
              {g}
            </span>
          ))}
        </div>
      )}

      {/* Read status */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-sand/30 dark:border-white/10">
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${readByNora ? 'bg-sage' : 'bg-sand'}`} />
          <span className={`text-xs ${readByNora ? 'text-sage font-medium' : 'text-ink-light/50'}`}>
            Nora
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${readBySara ? 'bg-sage' : 'bg-sand'}`} />
          <span className={`text-xs ${readBySara ? 'text-sage font-medium' : 'text-ink-light/50'}`}>
            Sara
          </span>
        </div>
        {book.spraak && (
          <span className="text-xs text-ink-light/50 ml-auto">
            {book.spraak}
          </span>
        )}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-sand/30 dark:border-white/10 space-y-2 text-sm">
          {book.eier && (
            <div className="flex gap-2">
              <span className="text-ink-light/60 dark:text-[#888] shrink-0">Eier:</span>
              <span className="text-ink dark:text-[#e0dcd5]">{book.eier}</span>
            </div>
          )}
          {book.kjoept && (
            <div className="flex gap-2">
              <span className="text-ink-light/60 dark:text-[#888] shrink-0">Kjøpt:</span>
              <span className="text-ink dark:text-[#e0dcd5]">{book.kjoept}</span>
            </div>
          )}
          {book.notater && (
            <div className="flex gap-2">
              <span className="text-ink-light/60 dark:text-[#888] shrink-0">Notater:</span>
              <span className="text-ink dark:text-[#e0dcd5] italic">{book.notater}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
