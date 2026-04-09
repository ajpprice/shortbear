'use strict'

require('dotenv').config()

const { Telegraf, session, Markup } = require('telegraf')
const { STOCKS, getStock }          = require('./stocks')
const { openPosition, closePosition, getOpenPositions, getClosedPositions } = require('./storage')
const { startEngine, getPrice }     = require('./engine')
const { positionCard, closedCard, formatPnL } = require('./format')

const bot = new Telegraf(process.env.BOT_TOKEN)

// ─── Session middleware ──────────────────────────────────────────────────────
bot.use(session({ defaultSession: () => ({ step: 'idle', draft: {} }) }))

// ─── Helpers ─────────────────────────────────────────────────────────────────
function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

const DURATION_OPTIONS = [
  { value: '1W', label: '1 Week',   days: 7  },
  { value: '1M', label: '1 Month',  days: 30 },
  { value: '3M', label: '3 Months', days: 90 },
]

const PAGE_SIZE = 9 // stocks per page in company picker

function stockPageKeyboard(page = 0) {
  const start   = page * PAGE_SIZE
  const slice   = STOCKS.slice(start, start + PAGE_SIZE)
  const rows    = []

  // 3 stocks per row
  for (let i = 0; i < slice.length; i += 3) {
    rows.push(slice.slice(i, i + 3).map(s => ({
      text: `${s.ticker}`,
      callback_data: `pick_stock:${s.ticker}`
    })))
  }

  // Pagination row
  const nav = []
  if (page > 0)                              nav.push({ text: '◀ Prev', callback_data: `stock_page:${page - 1}` })
  if (start + PAGE_SIZE < STOCKS.length)     nav.push({ text: 'Next ▶', callback_data: `stock_page:${page + 1}` })
  if (nav.length) rows.push(nav)

  rows.push([{ text: '❌ Cancel', callback_data: 'cancel' }])
  return { inline_keyboard: rows }
}

function durationKeyboard() {
  return Markup.inlineKeyboard([
    DURATION_OPTIONS.map(d => Markup.button.callback(d.label, `pick_dur:${d.value}`)),
    [Markup.button.callback('❌ Cancel', 'cancel')],
  ])
}

function confirmKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('🐻 Short it!', 'confirm_short'), Markup.button.callback('❌ Cancel', 'cancel')],
  ])
}

function mainMenuKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('🐻 Short a Stock', 'start_short')],
    [Markup.button.callback('📊 My Positions',  'positions'),
     Markup.button.callback('📜 History',        'history')],
  ])
}

// ─── /start ──────────────────────────────────────────────────────────────────
bot.start(async ctx => {
  ctx.session = { step: 'idle', draft: {} }
  await ctx.reply(
    `🐻 *Welcome to Short Bear!*\n\nBet against companies you hate.\n\n` +
    `Pick a company, set a duration (1W / 1M / 3M), and choose your max loss. ` +
    `We auto-close if the stock moves against you — you can never lose more than your margin.\n\n` +
    `_Simulated trading only. No real money._`,
    { parse_mode: 'Markdown', ...mainMenuKeyboard() }
  )
})

// ─── /menu ───────────────────────────────────────────────────────────────────
bot.command('menu', async ctx => {
  ctx.session = { step: 'idle', draft: {} }
  await ctx.reply('What do you want to do?', mainMenuKeyboard())
})

// ─── /positions ──────────────────────────────────────────────────────────────
async function showPositions(ctx) {
  const userId    = String(ctx.from.id)
  const positions = getOpenPositions(userId)

  if (positions.length === 0) {
    return ctx.reply(
      '📭 No open positions.\n\nFind a company to hate on!',
      Markup.inlineKeyboard([[Markup.button.callback('🐻 Short a Stock', 'start_short')]])
    )
  }

  const totalPnL  = positions.reduce((s, p) => s + (p.entryPrice - p.currentPrice) * p.shares, 0)
  const sign      = totalPnL >= 0 ? '+' : ''
  const header    = `📊 *Open Shorts* (${positions.length}) — Total P&L: *${sign}$${Math.abs(totalPnL).toFixed(2)}*\n\n`

  const cards = positions.map((p, i) => {
    return positionCard(p)
  }).join('\n\n─────────────────\n\n')

  // Close buttons for each position
  const closeButtons = positions.map(p =>
    [Markup.button.callback(`Close ${p.ticker}`, `close:${p.id}`)]
  )
  closeButtons.push([Markup.button.callback('🐻 Short Another', 'start_short')])

  await ctx.reply(header + cards, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard(closeButtons)
  })
}

bot.command('positions', showPositions)

// ─── /history ────────────────────────────────────────────────────────────────
async function showHistory(ctx) {
  const userId  = String(ctx.from.id)
  const closed  = getClosedPositions(userId).slice().reverse()

  if (closed.length === 0) {
    return ctx.reply('📜 No closed positions yet.')
  }

  const totalPnL  = closed.reduce((s, p) => s + (p.finalPnL ?? 0), 0)
  const winners   = closed.filter(p => (p.finalPnL ?? 0) >= 0).length
  const winRate   = Math.round((winners / closed.length) * 100)

  const header = `📜 *History* — ${closed.length} trades | Win rate: ${winRate}% | Total: *${formatPnL(totalPnL)}*\n\n`
  const cards  = closed.slice(0, 10).map(closedCard).join('\n\n')
  const footer = closed.length > 10 ? `\n\n_…and ${closed.length - 10} more_` : ''

  await ctx.reply(header + cards + footer, { parse_mode: 'Markdown' })
}

bot.command('history', showHistory)

// ─── /help ───────────────────────────────────────────────────────────────────
bot.command('help', async ctx => {
  await ctx.reply(
    `🐻 *Short Bear Commands*\n\n` +
    `/start — Main menu\n` +
    `/positions — View open shorts\n` +
    `/history — Closed trade history\n` +
    `/menu — Show main menu\n` +
    `/help — This message\n\n` +
    `*How it works:*\n` +
    `1. Pick a company you hate\n` +
    `2. Choose a duration (1W/1M/3M)\n` +
    `3. Set your max loss (stop-loss)\n` +
    `4. Watch the price tick every few seconds\n` +
    `5. Profit if the stock falls, auto-close if it rises to your stop\n\n` +
    `_Simulated trading. No real money._`,
    { parse_mode: 'Markdown' }
  )
})

// ─── FLOW: Short a Stock ─────────────────────────────────────────────────────

// Step 1: Pick company
bot.action('start_short', async ctx => {
  ctx.session = { step: 'pick_stock', draft: {}, page: 0 }
  await ctx.answerCbQuery()
  await ctx.reply(
    `🐻 *Step 1 of 3 — Pick a Company*\n\nChoose the stock you want to short:`,
    { parse_mode: 'Markdown', reply_markup: stockPageKeyboard(0) }
  )
})

// Pagination
bot.action(/^stock_page:(\d+)$/, async ctx => {
  const page = parseInt(ctx.match[1])
  ctx.session.page = page
  await ctx.answerCbQuery()
  await ctx.editMessageReplyMarkup(stockPageKeyboard(page))
})

// Stock selected
bot.action(/^pick_stock:(.+)$/, async ctx => {
  const ticker = ctx.match[1]
  const stock  = getStock(ticker)
  if (!stock) return ctx.answerCbQuery('Stock not found')

  ctx.session.step          = 'pick_duration'
  ctx.session.draft.ticker  = ticker
  await ctx.answerCbQuery()

  const currentPrice = getPrice(ticker)
  await ctx.editMessageText(
    `🐻 *Step 2 of 3 — Choose Duration*\n\n` +
    `*${stock.ticker}* — ${stock.name}\n` +
    `_"${stock.flavor}"_\n\n` +
    `Current price: *$${currentPrice.toFixed(2)}*\n\n` +
    `How long do you want to hold this short?`,
    { parse_mode: 'Markdown', ...durationKeyboard() }
  )
})

// Duration selected
bot.action(/^pick_dur:(.+)$/, async ctx => {
  const durValue = ctx.match[1]
  const dur      = DURATION_OPTIONS.find(d => d.value === durValue)
  if (!dur) return ctx.answerCbQuery()

  ctx.session.step              = 'enter_margin'
  ctx.session.draft.duration    = durValue
  ctx.session.draft.durationDays = dur.days

  const stock        = getStock(ctx.session.draft.ticker)
  const currentPrice = getPrice(ctx.session.draft.ticker)
  const expiry       = new Date(Date.now() + dur.days * 86400000)
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  await ctx.answerCbQuery()
  await ctx.editMessageText(
    `🐻 *Step 3 of 3 — Set Your Max Loss*\n\n` +
    `*${stock.ticker}* — ${dur.label} — Entry at $${currentPrice.toFixed(2)}\n` +
    `Expires: ${expiry}\n\n` +
    `How much are you willing to lose at most?\n` +
    `Reply with a dollar amount, e.g. *100*`,
    { parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '❌ Cancel', callback_data: 'cancel' }]] } }
  )
})

// Margin entered as a text message
bot.on('text', async ctx => {
  if (ctx.session?.step !== 'enter_margin') return

  const margin = parseFloat(ctx.message.text.replace(/[$,]/g, ''))
  if (isNaN(margin) || margin <= 0) {
    return ctx.reply('⚠️ Please enter a valid dollar amount, e.g. *100*', { parse_mode: 'Markdown' })
  }

  const { ticker, duration, durationDays } = ctx.session.draft
  const stock        = getStock(ticker)
  const entryPrice   = getPrice(ticker)
  const shares       = margin / entryPrice
  const stopLoss     = entryPrice * 2 // always 2x entry = exactly exhausts margin
  const maxProfit    = entryPrice * shares
  const expiry       = new Date(Date.now() + durationDays * 86400000)
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  ctx.session.step          = 'confirm'
  ctx.session.draft.margin  = margin
  ctx.session.draft.shares  = shares
  ctx.session.draft.entryPrice = entryPrice

  await ctx.reply(
    `🐻 *Confirm Your Short*\n\n` +
    `*${stock.ticker}* — ${stock.name}\n` +
    `_"${stock.flavor}"_\n\n` +
    `Entry price: *$${entryPrice.toFixed(2)}*\n` +
    `Shares: ${shares.toFixed(4)}\n` +
    `Duration: ${DURATION_OPTIONS.find(d => d.value === duration)?.label}\n` +
    `Expires: ${expiry}\n\n` +
    `🛑 Stop loss at: *$${stopLoss.toFixed(2)}* (+100%)\n` +
    `📉 Max loss: *-$${margin.toFixed(2)}*\n` +
    `🏆 Max profit (→ $0): *+$${maxProfit.toFixed(2)}*\n\n` +
    `_Simulated trading only._`,
    { parse_mode: 'Markdown', ...confirmKeyboard() }
  )
})

// Confirm short
bot.action('confirm_short', async ctx => {
  if (ctx.session?.step !== 'confirm') return ctx.answerCbQuery('Session expired. Start again.')

  const { ticker, duration, durationDays, margin, shares, entryPrice } = ctx.session.draft
  const stock    = getStock(ticker)
  const userId   = String(ctx.from.id)
  const now      = Date.now()

  const position = {
    id:           generateId(),
    status:       'open',
    ticker,
    companyName:  stock.name,
    sector:       stock.sector,
    entryPrice,
    duration,
    openedAt:     now,
    expiresAt:    now + durationDays * 86400000,
    marginAmount: margin,
    shares,
    stopLossPrice: entryPrice * 2,
    currentPrice:  entryPrice,
    closedAt:     null,
    exitPrice:    null,
    closeReason:  null,
    finalPnL:     null,
  }

  openPosition(userId, position)
  ctx.session = { step: 'idle', draft: {} }

  await ctx.answerCbQuery('Position opened! 🐻')
  await ctx.editMessageText(
    `✅ *Short opened!*\n\n` +
    `You're now short *${ticker}* at $${entryPrice.toFixed(2)}\n` +
    `Stop loss: $${position.stopLossPrice.toFixed(2)} | Max loss: -$${margin.toFixed(2)}\n\n` +
    `Prices tick every few seconds. I'll alert you if the stop loss triggers or the position expires.`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('📊 View positions', 'positions')],
        [Markup.button.callback('🐻 Short another',  'start_short')],
      ])
    }
  )
})

// ─── Close a position ─────────────────────────────────────────────────────────
bot.action(/^close:(.+)$/, async ctx => {
  const positionId = ctx.match[1]
  const userId     = String(ctx.from.id)
  const positions  = getOpenPositions(userId)
  const pos        = positions.find(p => p.id === positionId)

  if (!pos) return ctx.answerCbQuery('Position not found or already closed.')

  const exitPrice = pos.currentPrice
  closePosition(userId, positionId, 'manual', exitPrice)

  const pnl  = (pos.entryPrice - exitPrice) * pos.shares
  const sign = pnl >= 0 ? '+' : ''

  await ctx.answerCbQuery(`${pos.ticker} closed`)
  await ctx.reply(
    `✋ *Position closed manually*\n\n` +
    `*${pos.ticker}* — ${pos.companyName}\n` +
    `Entry $${pos.entryPrice.toFixed(2)} → Exit $${exitPrice.toFixed(2)}\n` +
    `P&L: *${sign}$${Math.abs(pnl).toFixed(2)}*`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([[Markup.button.callback('📊 View positions', 'positions')]])
    }
  )
})

// ─── Inline callbacks for menu buttons ───────────────────────────────────────
bot.action('positions', async ctx => { await ctx.answerCbQuery(); await showPositions(ctx) })
bot.action('history',   async ctx => { await ctx.answerCbQuery(); await showHistory(ctx) })

bot.action('cancel', async ctx => {
  ctx.session = { step: 'idle', draft: {} }
  await ctx.answerCbQuery('Cancelled')
  await ctx.editMessageText('Cancelled. What do you want to do?', mainMenuKeyboard())
})

// ─── Start ────────────────────────────────────────────────────────────────────
startEngine(bot)

bot.launch().then(() => {
  console.log('🐻 Short Bear bot is running')
}).catch(err => {
  console.error('Failed to start bot:', err.message)
  process.exit(1)
})

process.once('SIGINT',  () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
