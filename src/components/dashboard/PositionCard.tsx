import { useState, useEffect, useRef } from 'react'
import type { ShortPosition } from '../../types'
import { computePnL, computeMarginConsumed } from '../../types'
import { Sparkline } from '../shared/Sparkline'

interface PositionCardProps {
  position: ShortPosition
  onClose: (id: string) => void
}

function bearMood(consumedPct: number): string {
  if (consumedPct < 25) return '🐻'
  if (consumedPct < 60) return '😰'
  if (consumedPct < 85) return '🆘'
  return '💀'
}

function formatTimeRemaining(expiresAt: number): string {
  const ms = expiresAt - Date.now()
  if (ms <= 0) return 'Expired'
  const days = Math.floor(ms / 86400000)
  const hours = Math.floor((ms % 86400000) / 3600000)
  const mins = Math.floor((ms % 3600000) / 60000)
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m`
}

export function PositionCard({ position, onClose }: PositionCardProps) {
  const [confirmClose, setConfirmClose] = useState(false)
  const [flash, setFlash] = useState<'up' | 'down' | null>(null)
  const prevPrice = useRef(position.currentPrice)
  const [, forceUpdate] = useState(0)

  // Countdown timer
  useEffect(() => {
    const t = setInterval(() => forceUpdate(n => n + 1), 10000)
    return () => clearInterval(t)
  }, [])

  // Flash on price change
  useEffect(() => {
    if (position.currentPrice !== prevPrice.current) {
      setFlash(position.currentPrice > prevPrice.current ? 'up' : 'down')
      prevPrice.current = position.currentPrice
      const t = setTimeout(() => setFlash(null), 600)
      return () => clearTimeout(t)
    }
  }, [position.currentPrice])

  const pnl = computePnL(position)
  const consumed = computeMarginConsumed(position)
  const consumedPct = (consumed / position.marginAmount) * 100
  const winning = pnl >= 0

  const isClosed = position.status === 'closed'
  const finalPnl = position.finalPnL ?? pnl

  const progressColor =
    consumedPct < 60 ? 'bg-bear-teal' : consumedPct < 85 ? 'bg-amber-400' : 'bg-red-500'

  const priceChange = ((position.currentPrice - position.entryPrice) / position.entryPrice) * 100

  const closeReasonLabel: Record<string, string> = {
    expired: '⏰ Expired',
    stop_loss: '🛑 Stop Loss',
    manual: '✋ Closed',
  }

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 ${
        isClosed
          ? 'bg-gray-50 border-gray-200 opacity-75'
          : consumedPct >= 85
          ? 'bg-white border-red-200 shadow-md shadow-red-50'
          : 'bg-white border-gray-100 shadow-sm hover:shadow-md'
      } ${position.status === 'open' ? 'animate-card-in' : ''}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label="bear">
            {isClosed
              ? finalPnl >= 0 ? '🏆' : '😵'
              : bearMood(consumedPct)}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">{position.ticker}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                isClosed ? 'bg-gray-100 text-gray-500' : 'bg-bear-tealPale text-bear-tealDark'
              }`}>
                {position.sector}
              </span>
              {isClosed && position.closeReason && (
                <span className="text-xs px-1.5 py-0.5 rounded font-medium bg-gray-100 text-gray-600">
                  {closeReasonLabel[position.closeReason]}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">{position.companyName}</p>
          </div>
        </div>

        {/* P&L */}
        <div className={`text-right ${winning ? 'text-emerald-600' : 'text-red-500'}`}>
          <div className="font-bold text-lg leading-tight tabular-nums">
            {winning ? '+' : ''}${Math.abs(isClosed ? finalPnl : pnl).toFixed(2)}
          </div>
          <div className="text-xs font-medium opacity-80">
            {winning ? '▲' : '▼'} {Math.abs(priceChange).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Price row */}
      <div className="flex items-end justify-between mb-4 gap-4">
        <div className="flex gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Entry</p>
            <p className="font-semibold text-gray-700 tabular-nums">${position.entryPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Current</p>
            <p
              className={`font-bold tabular-nums transition-colors duration-300 ${
                flash === 'up' ? 'text-red-500' : flash === 'down' ? 'text-emerald-500' : 'text-gray-900'
              }`}
            >
              ${(isClosed ? position.exitPrice ?? position.currentPrice : position.currentPrice).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Stop Loss</p>
            <p className="font-semibold text-gray-500 tabular-nums">${position.stopLossPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Sparkline */}
        {position.priceHistory.length > 1 && (
          <Sparkline
            history={position.priceHistory}
            entryPrice={position.entryPrice}
            width={100}
            height={36}
          />
        )}
      </div>

      {/* Margin bar (only for open positions) */}
      {!isClosed && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Margin used ({consumedPct.toFixed(0)}%)</span>
            <span>${consumed.toFixed(2)} / ${position.marginAmount.toFixed(2)}</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
              style={{ width: `${Math.min(consumedPct, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          {isClosed
            ? `Closed ${new Date(position.closedAt!).toLocaleDateString()}`
            : `Expires in ${formatTimeRemaining(position.expiresAt)}`}
        </span>
        <span>${position.marginAmount} max risk</span>

        {!isClosed && (
          <div>
            {!confirmClose ? (
              <button
                onClick={() => setConfirmClose(true)}
                className="text-gray-400 hover:text-red-500 transition-colors font-medium"
              >
                Close
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Sure?</span>
                <button
                  onClick={() => { onClose(position.id); setConfirmClose(false) }}
                  className="text-red-500 font-semibold hover:text-red-700"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmClose(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  No
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
