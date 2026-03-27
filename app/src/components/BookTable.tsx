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

interface BookTableProps {
  books: Book[]
}

export function BookTable({ books }: BookTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-sand/40 dark:border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-sand/20 dark:bg-white/5 border-b border-sand/40 dark:border-white/10 text-left">
            <th className="px-4 py-3 font-semibold text-ink dark:text-[#e0dcd5] whitespace-nowrap">Tittel</th>
            <th className="px-4 py-3 font-semibold text-ink dark:text-[#e0dcd5] whitespace-nowrap">Forfatter</th>
            <th className="px-4 py-3 font-semibold text-ink dark:text-[#e0dcd5] whitespace-nowrap hidden sm:table-cell">Sjanger</th>
            <th className="px-4 py-3 font-semibold text-ink dark:text-[#e0dcd5] whitespace-nowrap hidden md:table-cell">Format</th>
            <th className="px-4 py-3 font-semibold text-ink dark:text-[#e0dcd5] whitespace-nowrap hidden md:table-cell">Språk</th>
            <th className="px-4 py-3 text-center font-semibold text-ink dark:text-[#e0dcd5] whitespace-nowrap">Lest</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sand/30 dark:divide-white/5">
          {books.map((book, i) => {
            const genres = book.sjanger.split(',').map(g => g.trim()).filter(Boolean)
            const isExpanded = expandedRow === i

            return (
              <>
                <tr
                  key={`${book.tittel}-${i}`}
                  onClick={() => setExpandedRow(isExpanded ? null : i)}
                  className="cursor-pointer hover:bg-sand/10 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-2.5 font-medium text-ink dark:text-[#e0dcd5] max-w-[200px] truncate">
                    {book.tittel}
                  </td>
                  <td className="px-4 py-2.5 text-ink-light dark:text-[#999] max-w-[160px] truncate">
                    {book.forfatter}
                  </td>
                  <td className="px-4 py-2.5 hidden sm:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {genres.slice(0, 2).map(g => (
                        <span key={g} className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${getGenreColor(g)}`}>
                          {g}
                        </span>
                      ))}
                      {genres.length > 2 && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-sand/60 text-ink-light">
                          +{genres.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 hidden md:table-cell text-ink-light dark:text-[#999]">
                    {book.eierform && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        book.eierform === 'Kindle' ? 'bg-navy/10 text-navy' : 'bg-leather/10 text-leather-dark'
                      }`}>
                        {book.eierform}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 hidden md:table-cell text-ink-light dark:text-[#999] text-xs">
                    {book.spraak}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex items-center gap-1" title="Nora">
                        <div className={`w-2 h-2 rounded-full ${book.lestNora ? 'bg-sage' : 'bg-sand'}`} />
                        <span className={`text-xs hidden lg:inline ${book.lestNora ? 'text-sage font-medium' : 'text-ink-light/40'}`}>N</span>
                      </div>
                      <div className="flex items-center gap-1" title="Sara">
                        <div className={`w-2 h-2 rounded-full ${book.lestSara ? 'bg-sage' : 'bg-sand'}`} />
                        <span className={`text-xs hidden lg:inline ${book.lestSara ? 'text-sage font-medium' : 'text-ink-light/40'}`}>S</span>
                      </div>
                    </div>
                  </td>
                </tr>
                {isExpanded && (
                  <tr key={`${book.tittel}-${i}-expanded`} className="bg-sand/5 dark:bg-white/3">
                    <td colSpan={6} className="px-4 py-3">
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-light dark:text-[#999]">
                        {book.eier && <span><span className="font-medium">Eier:</span> {book.eier}</span>}
                        {book.kjoept && <span><span className="font-medium">Kjøpt:</span> {book.kjoept}</span>}
                        {book.notater && <span><span className="font-medium">Notater:</span> <span className="italic">{book.notater}</span></span>}
                        <span className="sm:hidden"><span className="font-medium">Sjanger:</span> {book.sjanger}</span>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
