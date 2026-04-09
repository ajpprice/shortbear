import type { ShortPosition } from '../../types'
import { computePnL } from '../../types'

interface PortfolioSummaryProps {
  openPositions: ShortPosition[]
}

export function PortfolioSummary({ openPositions }: PortfolioSummaryProps) {
  if (openPositions.length === 0) return null

  const totalMarginAtRisk = openPositions.reduce((s, p) => s + p.marginAmount, 0)
  const totalPnL = openPositions.reduce((s, p) => s + computePnL(p), 0)
  const winning = openPositions.filter(p => computePnL(p) >= 0).length
  const winRate = Math.round((winning / openPositions.length) * 100)

  const mood = totalPnL >= 0
    ? (totalPnL > totalMarginAtRisk * 0.1 ? '🐻 Bears winning!' : '🐻 Bears up')
    : (totalPnL < -totalMarginAtRisk * 0.3 ? '😰 Bears in pain' : '😬 Bears struggling')

  return (
    <div className="bg-bear-teal rounded-2xl p-5 text-white mb-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-bear-tealLight text-sm font-medium">{mood}</p>
          <p className="text-3xl font-bold tabular-nums mt-0.5">
            {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
          </p>
          <p className="text-bear-tealLight text-xs mt-0.5">unrealized P&L</p>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold">{openPositions.length}</p>
            <p className="text-bear-tealLight text-xs">open shorts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">${totalMarginAtRisk.toFixed(0)}</p>
            <p className="text-bear-tealLight text-xs">margin at risk</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{winRate}%</p>
            <p className="text-bear-tealLight text-xs">winning</p>
          </div>
        </div>
      </div>
    </div>
  )
}
