export type Duration = '1W' | '1M' | '3M'
export type CloseReason = 'expired' | 'stop_loss' | 'manual'
export type PositionStatus = 'open' | 'closed'

export interface MockStock {
  ticker: string         // xStocks ticker (e.g. "CMCSA" — traded as CMCSAx)
  name: string
  sector: string
  basePrice: number
  volatility: number
  drift: number
  bearishFlavor: string  // default suggestion for the "receipt" prompt
}

export interface PricePoint {
  timestamp: number
  price: number
}

export interface ShortPosition {
  id: string
  status: PositionStatus

  ticker: string
  companyName: string
  sector: string

  entryPrice: number
  duration: Duration
  openedAt: number
  expiresAt: number

  marginAmount: number
  shares: number
  stopLossPrice: number

  // The "receipt" — user's reason for shorting (the review)
  receipt: string

  currentPrice: number
  priceHistory: PricePoint[]

  closedAt: number | null
  exitPrice: number | null
  closeReason: CloseReason | null
  finalPnL: number | null
}

export function computePnL(pos: ShortPosition): number {
  const price = pos.exitPrice ?? pos.currentPrice
  return (pos.entryPrice - price) * pos.shares
}

export function computeMarginConsumed(pos: ShortPosition): number {
  return Math.max(0, -computePnL(pos))
}
