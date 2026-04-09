'use strict'

const fs   = require('fs')
const path = require('path')

const DATA_DIR = path.join(__dirname, '..', 'data')

function userFile(userId) {
  return path.join(DATA_DIR, `${userId}.json`)
}

function loadUser(userId) {
  try {
    return JSON.parse(fs.readFileSync(userFile(userId), 'utf8'))
  } catch {
    return { positions: [] }
  }
}

function saveUser(userId, data) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(userFile(userId), JSON.stringify(data, null, 2))
}

function getAllUserIds() {
  if (!fs.existsSync(DATA_DIR)) return []
  return fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))
}

function openPosition(userId, position) {
  const data = loadUser(userId)
  data.positions.push(position)
  saveUser(userId, data)
}

function closePosition(userId, positionId, reason, exitPrice) {
  const data = loadUser(userId)
  data.positions = data.positions.map(p => {
    if (p.id !== positionId || p.status === 'closed') return p
    const finalPnL = (p.entryPrice - exitPrice) * p.shares
    return { ...p, status: 'closed', closedAt: Date.now(), exitPrice, closeReason: reason, finalPnL }
  })
  saveUser(userId, data)
}

// Update all open positions with a given ticker's new price.
// Returns array of auto-closed positions { userId, position } for alerting.
function tickPrice(ticker, newPrice) {
  const autoClosedAlerts = []
  const userIds = getAllUserIds()

  for (const userId of userIds) {
    const data = loadUser(userId)
    let changed = false

    data.positions = data.positions.map(p => {
      if (p.status === 'closed' || p.ticker !== ticker) return p
      changed = true

      // Expiry check
      if (Date.now() >= p.expiresAt) {
        const finalPnL = (p.entryPrice - newPrice) * p.shares
        const closed = { ...p, status: 'closed', currentPrice: newPrice, closedAt: Date.now(), exitPrice: newPrice, closeReason: 'expired', finalPnL }
        autoClosedAlerts.push({ userId, position: closed })
        return closed
      }

      // Stop-loss check
      if (newPrice >= p.stopLossPrice) {
        const finalPnL = -p.marginAmount
        const closed = { ...p, status: 'closed', currentPrice: p.stopLossPrice, closedAt: Date.now(), exitPrice: p.stopLossPrice, closeReason: 'stop_loss', finalPnL }
        autoClosedAlerts.push({ userId, position: closed })
        return closed
      }

      return { ...p, currentPrice: newPrice }
    })

    if (changed) saveUser(userId, data)
  }

  return autoClosedAlerts
}

function getOpenPositions(userId) {
  return loadUser(userId).positions.filter(p => p.status === 'open')
}

function getClosedPositions(userId) {
  return loadUser(userId).positions.filter(p => p.status === 'closed')
}

module.exports = { openPosition, closePosition, tickPrice, getOpenPositions, getClosedPositions, getAllUserIds }
