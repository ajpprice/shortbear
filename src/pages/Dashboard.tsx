import { useState } from 'react'
import type { ShortPosition, Duration } from '../types'
import { PortfolioSummary } from '../components/dashboard/PortfolioSummary'
import { PositionCard } from '../components/dashboard/PositionCard'
import { OpenPositionModal } from '../components/trade/OpenPositionModal'

interface DashboardProps {
  openPositions: ShortPosition[]
  recentlyClosed: ShortPosition[]
  onOpen: (ticker: string, duration: Duration, margin: number) => void
  onClose: (id: string) => void
}

export function Dashboard({ openPositions, recentlyClosed, onOpen, onClose }: DashboardProps) {
  const [showModal, setShowModal] = useState(false)

  const existingTickers = openPositions.map(p => p.ticker)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <PortfolioSummary openPositions={openPositions} />

      {/* CTA */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Your Shorts</h1>
          {openPositions.length === 0 && (
            <p className="text-gray-400 text-sm mt-0.5">No open positions.</p>
          )}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-bear-teal hover:bg-bear-tealDark text-white font-bold rounded-xl transition-colors shadow-sm active:scale-[0.97]"
        >
          <span>🐻</span> Short a Stock
        </button>
      </div>

      {/* Empty state */}
      {openPositions.length === 0 && (
        <div
          className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center cursor-pointer hover:border-bear-tealLight hover:bg-bear-tealPale/30 transition-colors"
          onClick={() => setShowModal(true)}
        >
          <div className="text-6xl mb-5">🐻</div>
          <h3 className="text-2xl font-extrabold text-gray-700 mb-2">Don't leave a 1-star review.</h3>
          <p className="text-gray-400 text-base mb-1">Short the stock instead.</p>
          <p className="text-gray-300 text-sm">Put your money where your anger is.</p>
        </div>
      )}

      {/* Open positions grid */}
      {openPositions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {openPositions.map(p => (
            <PositionCard key={p.id} position={p} onClose={onClose} />
          ))}
        </div>
      )}

      {/* Recently closed */}
      {recentlyClosed.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Recently Closed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentlyClosed.slice(0, 4).map(p => (
              <PositionCard key={p.id} position={p} onClose={onClose} />
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <OpenPositionModal
          onOpen={onOpen}
          onClose={() => setShowModal(false)}
          existingTickers={existingTickers}
        />
      )}
    </div>
  )
}
