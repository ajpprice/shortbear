import { useState } from 'react'
import type { Duration } from './types'
import { computePnL } from './types'
import { usePositions } from './hooks/usePositions'
import { usePriceEngine } from './hooks/usePriceEngine'
import { Header } from './components/layout/Header'
import { Dashboard } from './pages/Dashboard'
import { History } from './pages/History'

type View = 'dashboard' | 'history'

export default function App() {
  const [view, setView] = useState<View>('dashboard')
  const { openPositions, closedPositions, openShort, closePosition, updatePrice, clearHistory } = usePositions()

  usePriceEngine({ openPositions, updatePrice })

  const totalPnL =
    openPositions.reduce((s, p) => s + computePnL(p), 0) +
    closedPositions.reduce((s, p) => s + (p.finalPnL ?? 0), 0)

  const handleOpen = (ticker: string, duration: Duration, margin: number) => {
    openShort(ticker, duration, margin)
  }

  const handleClose = (id: string) => {
    closePosition(id, 'manual')
  }

  return (
    <div className="min-h-screen bg-bear-cream font-sans">
      <Header view={view} onViewChange={setView} totalPnL={totalPnL} />
      <main>
        {view === 'dashboard' ? (
          <Dashboard
            openPositions={openPositions}
            recentlyClosed={closedPositions.slice(-4).reverse()}
            onOpen={handleOpen}
            onClose={handleClose}
          />
        ) : (
          <History closedPositions={closedPositions} onClear={clearHistory} />
        )}
      </main>
    </div>
  )
}
