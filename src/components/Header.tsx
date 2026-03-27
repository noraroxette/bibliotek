import { ViewMode } from '../types'

interface HeaderProps {
  view: ViewMode
  setView: (v: ViewMode) => void
  totalBooks: number
  dark: boolean
  setDark: (v: boolean) => void
}

export function Header({ view, setView, totalBooks, dark, setDark }: HeaderProps) {
  return (
    <header className="bg-leather-dark dark:bg-[#111] text-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('stats')}>
            <span className="text-4xl leading-none">📚</span>
            <div>
                <h1 className="text-xl sm:text-2xl font-serif font-semibold text-warm-white">
                {/* <h1 className="font-serif text-xl sm:text-3xl font-bold tracking-tight text-warm-white"> */}
                Biblioteket
              </h1>
              <p className="mt-1 text-sand text-sm">
                {totalBooks} bøker i samlingen
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <nav className="flex gap-1">
           {/* <nav className="flex gap-1 bg-leather/50 dark:bg-white/10 rounded-lg p-1">  */}
              <button
                onClick={() => setView('stats')}
                className={`px-4 py-2.5 cursor-pointer text-sm font-medium transition-all ${
                  view === 'stats'
                    ? 'border-b-2'
                    : 'text-sand hover:text-warm-white'
                }`}
                // className={`px-5 py-2.5 cursor-pointer rounded-md text-sm font-medium transition-all ${
                //   view === 'stats'
                //     ? 'bg-warm-white text-leather-dark shadow-sm dark:bg-white/90 dark:text-[#111]'
                //     : 'text-sand hover:text-warm-white hover:bg-leather/40 dark:hover:bg-white/10'
                // }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Statistikk
                </span>
              </button>
              <button
                onClick={() => setView('library')}
                className={`px-4 py-2.5 cursor-pointer text-sm font-medium transition-all ${
                  view === 'library'
                    ? 'border-b-2'
                    : 'text-sand hover:text-warm-white'
                }`}
                // className={`px-5 py-2.5 cursor-pointer rounded-md text-sm font-medium transition-all ${
                //   view === 'library'
                //     ? 'bg-warm-white text-leather-dark shadow-sm dark:bg-white/90 dark:text-[#111]'
                //     : 'text-sand hover:text-warm-white hover:bg-leather/40 dark:hover:bg-white/10'
                // }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Alle bøker
                </span>
              </button>
            </nav>
            <button
              onClick={() => setDark(!dark)}
              className="pl-3 pr-4 py-1.5 border border-sand/30 rounded-full text-sand cursor-pointer hover:text-warm-white hover:border-sand/60 transition-all flex items-center gap-2 text-xs"
              title={dark ? 'Lyst' : 'Mørkt'}
            >
              {dark ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Mørkt</span>
                </>
              ) : (
                // Noen ikoner som også kan brukes: '🌙' '☀️' om ikke svg
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span>Lyst</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
