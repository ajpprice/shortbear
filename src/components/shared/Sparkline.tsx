import type { PricePoint } from '../../types'

interface SparklineProps {
  history: PricePoint[]
  entryPrice: number
  width?: number
  height?: number
}

export function Sparkline({ history, entryPrice, width = 120, height = 40 }: SparklineProps) {
  if (history.length < 2) return null

  const prices = history.map(p => p.price)
  const min = Math.min(...prices, entryPrice * 0.95)
  const max = Math.max(...prices, entryPrice * 1.05)
  const range = max - min || 1

  const points = prices.map((price, i) => {
    const x = (i / (prices.length - 1)) * width
    const y = height - ((price - min) / range) * height
    return `${x},${y}`
  })

  const currentPrice = prices[prices.length - 1]
  const winning = currentPrice < entryPrice
  const color = winning ? '#1A9E8F' : '#ef4444'

  // Entry price line y position
  const entryY = height - ((entryPrice - min) / range) * height

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Entry price dashed line */}
      <line
        x1={0} y1={entryY} x2={width} y2={entryY}
        stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3"
      />
      {/* Price line */}
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Current price dot */}
      <circle
        cx={(prices.length - 1) / (prices.length - 1) * width}
        cy={height - ((currentPrice - min) / range) * height}
        r="3"
        fill={color}
      />
    </svg>
  )
}
