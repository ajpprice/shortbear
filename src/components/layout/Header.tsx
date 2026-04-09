interface HeaderProps {
  view: 'dashboard' | 'history'
  onViewChange: (v: 'dashboard' | 'history') => void
  totalPnL: number
}

export function Header({ view, onViewChange, totalPnL }: HeaderProps) {
  const pnlColor = totalPnL >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
  const sign = totalPnL >= 0 ? '+' : ''

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo + name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-bear-teal flex items-center justify-center text-xl flex-shrink-0">
            🐻
          </div>
          <div>
            <span className="font-extrabold text-xl text-bear-brown tracking-tight">Short Bear</span>
            <span className="hidden sm:block text-xs text-gray-400 font-medium -mt-0.5">Don't review it. Short it.</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              view === 'dashboard'
                ? 'bg-bear-teal text-white'
                : 'text-gray-500 hover:text-bear-teal hover:bg-bear-tealPale'
            }`}
          >
            Positions
          </button>
          <button
            onClick={() => onViewChange('history')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              view === 'history'
                ? 'bg-bear-teal text-white'
                : 'text-gray-500 hover:text-bear-teal hover:bg-bear-tealPale'
            }`}
          >
            History
          </button>
        </nav>

        {/* P&L */}
        <div className={`px-3 py-1.5 rounded-lg text-sm font-bold tabular-nums ${pnlColor}`}>
          {sign}${Math.abs(totalPnL).toFixed(2)}
          <span className="font-normal ml-1 opacity-70">total P&L</span>
        </div>
      </div>
    </header>
  )
}
