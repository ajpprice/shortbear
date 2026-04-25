import { useState, useCallback } from 'react'
import type { ShortPosition, Duration, CloseReason } from '../types'
import { MOCK_STOCKS, DURATION_OPTIONS, MAX_PRICE_HISTORY } from '../constants'
import { loadPositions, savePositions } from '../lib/storage'

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function usePositions() {
  const [positions, setPositions] = useState<ShortPosition[]>(() => loadPositions())

  const update = useCallback((updater: (prev: ShortPosition[]) => ShortPosition[]) => {
    setPositions(prev => {
      const next = updater(prev)
      savePositions(next)
      return next
    })
  }, [])

  const openShort = useCallback((ticker: string, duration: Duration, marginAmount: number, receipt: string) => {
    const stock = MOCK_STOCKS.find(s => s.ticker === ticker)
    if (!stock) return

    const durationConfig = DURATION_OPTIONS.find(d => d.value === duration)!
    const now = Date.now()
    const expiresAt = now + durationConfig.days * 24 * 60 * 60 * 1000
    const entryPrice = stock.basePrice
    const shares = marginAmount / entryPrice
    const stopLossPrice = entryPrice + marginAmount / shares // = entryPrice * 2

    const position: ShortPosition = {
      id: generateId(),
      status: 'open',
      ticker: stock.ticker,
      companyName: stock.name,
      sector: stock.sector,
      entryPrice,
      duration,
      openedAt: now,
      expiresAt,
      marginAmount,
      shares,
      stopLossPrice,
      receipt,
      currentPrice: entryPrice,
      priceHistory: [{ timestamp: now, price: entryPrice }],
      closedAt: null,
      exitPrice: null,
      closeReason: null,
      finalPnL: null,
    }

    update(prev => [position, ...prev])
    return position.id
  }, [update])

  const closePosition = useCallback((id: string, reason: CloseReason, exitPrice?: number) => {
    update(prev =>
      prev.map(p => {
        if (p.id !== id || p.status === 'closed') return p
        const price = exitPrice ?? p.currentPrice
        const finalPnL = (p.entryPrice - price) * p.shares
        return {
          ...p,
          status: 'closed' as const,
          closedAt: Date.now(),
          exitPrice: price,
          closeReason: reason,
          finalPnL,
        }
      })
    )
  }, [update])

  const updatePrice = useCallback((ticker: string, newPrice: number) => {
    update(prev =>
      prev.map(p => {
        if (p.status === 'closed' || p.ticker !== ticker) return p

        // Check expiry
        if (Date.now() >= p.expiresAt) {
          const finalPnL = (p.entryPrice - newPrice) * p.shares
          return {
            ...p,
            status: 'closed' as const,
            currentPrice: newPrice,
            closedAt: Date.now(),
            exitPrice: newPrice,
            closeReason: 'expired' as const,
            finalPnL,
          }
        }

        // Check stop loss
        if (newPrice >= p.stopLossPrice) {
          const finalPnL = -p.marginAmount
          return {
            ...p,
            status: 'closed' as const,
            currentPrice: p.stopLossPrice,
            closedAt: Date.now(),
            exitPrice: p.stopLossPrice,
            closeReason: 'stop_loss' as const,
            finalPnL,
          }
        }

        const newHistory = [
          ...p.priceHistory.slice(-MAX_PRICE_HISTORY + 1),
          { timestamp: Date.now(), price: newPrice },
        ]

        return { ...p, currentPrice: newPrice, priceHistory: newHistory }
      })
    )
  }, [update])

  const clearHistory = useCallback(() => {
    update(prev => prev.filter(p => p.status === 'open'))
  }, [update])

  const openPositions = positions.filter(p => p.status === 'open')
  const closedPositions = positions.filter(p => p.status === 'closed')

  return { positions, openPositions, closedPositions, openShort, closePosition, updatePrice, clearHistory }
}
