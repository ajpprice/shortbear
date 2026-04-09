import { useState } from 'react'
import type { ShortPosition } from '../types'

interface HistoryProps {
  closedPositions: ShortPosition[]
  onClear: () => void
}

const closeReasonLabel: Record<string, { label: string; color: string }> = {
  expired: { label: 'Expired', color: 'bg-gray-100 text-gray-600' },
  stop_loss: { label: 'Stop Loss', color: 'bg-red-100 text-red-600' },
  manual: { label: 'Manual', color: 'bg-blue-100 text-blue-600' },
}

export function History({ closedPositions, onClear }: HistoryProps) {
  const [confirmClear, setConfirmClear] = useState(false)

  const totalPnL = closedPositions.reduce((s, p) => s + (p.finalPnL ?? 0), 0)
  const winners = closedPositions.filter(p => (p.finalPnL ?? 0) >= 0)
  const winRate = closedPositions.length ? Math.round((winners.length / closedPositions.length) * 100) : 0
  const best = closedPositions.length ? Math.max(...closedPositions.map(p => p.finalPnL ?? 0)) : 0
  const worst = closedPositions.length ? Math.min(...closedPositions.map(p => p.finalPnL ?? 0)) : 0

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">History</h1>
        {closedPositions.length > 0 && (
          <div>
            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear history
              </button>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Delete all?</span>
                <button onClick={() => { onClear(); setConfirmClear(false) }} className="text-red-500 font-bold">Yes</button>
                <button onClick={() => setConfirmClear(false)} className="text-gray-400">No</button>
              </div>
            )}
          </div>
        )}
      </div>

      {closedPositions.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📜</div>
          <p className="text-gray-400 font-medium">No closed positions yet.</p>
          <p className="text-gray-300 text-sm">Your trade history will appear here.</p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total P&L', value: `${totalPnL >= 0 ? '+' : ''}$${totalPnL.toFixed(2)}`, color: totalPnL >= 0 ? 'text-emerald-600' : 'text-red-500' },
              { label: 'Win Rate', value: `${winRate}%`, color: 'text-gray-900' },
              { label: 'Best Short', value: `+$${best.toFixed(2)}`, color: 'text-emerald-600' },
              { label: 'Worst Short', value: `$${worst.toFixed(2)}`, color: 'text-red-500' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className="text-xs text-gray-400 font-medium mb-1">{stat.label}</p>
                <p className={`text-xl font-bold tabular-nums ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 font-semibold text-gray-500">Company</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-500">Entry</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-500">Exit</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-500">Duration</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-500">Reason</th>
                    <th className="text-right px-5 py-3 font-semibold text-gray-500">P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[...closedPositions].reverse().map(p => {
                    const pnl = p.finalPnL ?? 0
                    const reason = closeReasonLabel[p.closeReason ?? 'manual']
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-gray-900">{p.ticker}</div>
                          <div className="text-xs text-gray-400">{p.companyName}</div>
                        </td>
                        <td className="px-4 py-3.5 text-right text-gray-700 tabular-nums">${p.entryPrice.toFixed(2)}</td>
                        <td className="px-4 py-3.5 text-right text-gray-700 tabular-nums">${(p.exitPrice ?? 0).toFixed(2)}</td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-medium">{p.duration}</span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${reason.color}`}>{reason.label}</span>
                        </td>
                        <td className={`px-5 py-3.5 text-right font-bold tabular-nums ${pnl >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
