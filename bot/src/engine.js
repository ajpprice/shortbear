'use strict'

const { STOCKS }    = require('./stocks')
const { nextPrice } = require('./simulator')
const { tickPrice, getAllUserIds, getOpenPositions } = require('./storage')

const TICK_MS = 3000

// Current simulated prices per ticker (seeded from basePrice)
const prices = {}
STOCKS.forEach(s => { prices[s.ticker] = s.basePrice })

function getPrice(ticker) {
  return prices[ticker]
}

function startEngine(bot) {
  setInterval(() => {
    // Find tickers that have at least one open position across all users
    const userIds = getAllUserIds()
    const activeTickers = new Set()
    for (const uid of userIds) {
      getOpenPositions(uid).forEach(p => activeTickers.add(p.ticker))
    }

    for (const ticker of activeTickers) {
      const stock = STOCKS.find(s => s.ticker === ticker)
      if (!stock) continue

      const newPrice = nextPrice(prices[ticker], stock.volatility, stock.drift)
      prices[ticker] = newPrice

      const alerts = tickPrice(ticker, newPrice)

      // Send alerts for auto-closed positions
      for (const { userId, position } of alerts) {
        const pnl    = position.finalPnL
        const sign   = pnl >= 0 ? '+' : ''
        const emoji  = position.closeReason === 'stop_loss'
          ? '🛑'
          : pnl >= 0 ? '🏆' : '😵'

        const reason = position.closeReason === 'stop_loss'
          ? 'Stop loss triggered'
          : 'Position expired'

        bot.telegram.sendMessage(userId,
          `${emoji} *${reason}*\n\n` +
          `*${position.ticker}* — ${position.companyName}\n` +
          `Entry: $${position.entryPrice.toFixed(2)} → Exit: $${position.exitPrice.toFixed(2)}\n` +
          `P&L: *${sign}$${Math.abs(pnl).toFixed(2)}*`,
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [[{ text: '📊 View positions', callback_data: 'positions' }]]
            }
          }
        ).catch(() => {}) // user may have blocked the bot
      }
    }
  }, TICK_MS)
}

module.exports = { startEngine, getPrice }
