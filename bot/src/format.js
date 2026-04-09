'use strict'

function formatPnL(pnl) {
  const sign = pnl >= 0 ? '+' : ''
  return `${sign}$${Math.abs(pnl).toFixed(2)}`
}

function bearMood(consumedPct) {
  if (consumedPct < 25) return '🐻'
  if (consumedPct < 60) return '😰'
  if (consumedPct < 85) return '🆘'
  return '💀'
}

function timeRemaining(expiresAt) {
  const ms = expiresAt - Date.now()
  if (ms <= 0) return 'Expired'
  const days  = Math.floor(ms / 86400000)
  const hours = Math.floor((ms % 86400000) / 3600000)
  const mins  = Math.floor((ms % 3600000) / 60000)
  if (days > 0)  return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m`
}

function positionCard(p) {
  const pnl          = (p.entryPrice - p.currentPrice) * p.shares
  const consumed     = Math.max(0, -pnl)
  const consumedPct  = (consumed / p.marginAmount) * 100
  const sign         = pnl >= 0 ? '+' : ''
  const mood         = bearMood(consumedPct)

  return (
    `${mood} *${p.ticker}* — ${p.companyName}\n` +
    `Entry $${p.entryPrice.toFixed(2)} → Now $${p.currentPrice.toFixed(2)} | Stop $${p.stopLossPrice.toFixed(2)}\n` +
    `P&L: *${sign}$${Math.abs(pnl).toFixed(2)}* (${pnl >= 0 ? '▲' : '▼'}${Math.abs(((p.currentPrice - p.entryPrice) / p.entryPrice) * 100).toFixed(1)}%)\n` +
    `Margin: ${consumedPct.toFixed(0)}% used | Expires: ${timeRemaining(p.expiresAt)}`
  )
}

function closedCard(p) {
  const pnl    = p.finalPnL ?? 0
  const sign   = pnl >= 0 ? '+' : ''
  const emoji  = pnl >= 0 ? '🏆' : '😵'
  const reason = { expired: '⏰ Expired', stop_loss: '🛑 Stop loss', manual: '✋ Closed' }[p.closeReason] ?? ''

  return (
    `${emoji} *${p.ticker}* ${reason}\n` +
    `Entry $${p.entryPrice.toFixed(2)} → Exit $${p.exitPrice?.toFixed(2)}\n` +
    `P&L: *${sign}$${Math.abs(pnl).toFixed(2)}*`
  )
}

module.exports = { formatPnL, positionCard, closedCard, timeRemaining }
