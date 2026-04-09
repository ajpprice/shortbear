import { useEffect, useRef } from 'react'
import type { ShortPosition } from '../types'
import { MOCK_STOCKS, TICK_INTERVAL_MS } from '../constants'
import { nextPrice } from '../lib/priceSimulator'

interface UsePriceEngineProps {
  openPositions: ShortPosition[]
  updatePrice: (ticker: string, newPrice: number) => void
}

export function usePriceEngine({ openPositions, updatePrice }: UsePriceEngineProps) {
  // Track current prices per ticker so GBM builds on last known price
  const priceMap = useRef<Map<string, number>>(new Map())

  // Sync priceMap from positions on mount / changes
  useEffect(() => {
    openPositions.forEach(p => {
      if (!priceMap.current.has(p.ticker)) {
        priceMap.current.set(p.ticker, p.currentPrice)
      }
    })
  }, [openPositions])

  useEffect(() => {
    if (openPositions.length === 0) return

    const interval = setInterval(() => {
      // Get unique tickers from open positions
      const tickers = [...new Set(openPositions.map(p => p.ticker))]

      tickers.forEach(ticker => {
        const stock = MOCK_STOCKS.find(s => s.ticker === ticker)
        if (!stock) return

        const current = priceMap.current.get(ticker) ?? stock.basePrice
        const newPrice = nextPrice(current, stock.volatility, stock.drift)
        // Clamp to prevent negative/near-zero prices
        const clamped = Math.max(newPrice, 0.01)
        priceMap.current.set(ticker, clamped)
        updatePrice(ticker, clamped)
      })
    }, TICK_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [openPositions, updatePrice])
}
