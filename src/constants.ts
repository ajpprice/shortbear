import type { MockStock, Duration } from './types'

export const MOCK_STOCKS: MockStock[] = [
  { ticker: 'TRST', name: 'Trustpilot', sector: 'Reviews', basePrice: 58, volatility: 0.038, drift: -0.0018, bearishFlavor: 'Sells fake review removal. The reviews are also fake.' },
  { ticker: 'CBLE', name: 'CableCo Inc', sector: 'Telecom', basePrice: 43, volatility: 0.019, drift: -0.0007, bearishFlavor: '7-hour service window. Tech never showed.' },
  { ticker: 'AIRL', name: 'BudgetWings Air', sector: 'Airlines', basePrice: 11, volatility: 0.048, drift: -0.0014, bearishFlavor: 'Charges for carry-on, window seat, and leg room. Working on charging for oxygen.' },
  { ticker: 'WLLS', name: 'WellsDeep Bank', sector: 'Banking', basePrice: 52, volatility: 0.022, drift: -0.0009, bearishFlavor: 'Opened 4 accounts in your name. Very sorry about it.' },
  { ticker: 'PDAY', name: 'QuickCash Lending', sector: 'Fintech', basePrice: 29, volatility: 0.041, drift: -0.0021, bearishFlavor: 'APR: 847%. But it\'s short-term so it\'s fine.' },
  { ticker: 'DENY', name: 'DenyFirst Insurance', sector: 'Insurance', basePrice: 88, volatility: 0.017, drift: -0.0006, bearishFlavor: 'Claims processing time: geological era.' },
  { ticker: 'TICK', name: 'TicketMark Inc', sector: 'Entertainment', basePrice: 67, volatility: 0.034, drift: -0.0013, bearishFlavor: 'Convenience fee: $47. Convenience: none.' },
  { ticker: 'SURG', name: 'SurgeRide Corp', sector: 'Transport', basePrice: 38, volatility: 0.039, drift: -0.0011, bearishFlavor: 'Multiplier: 4.2x. Reason: it\'s drizzling.' },
  { ticker: 'DLVR', name: 'DashSurge Delivery', sector: 'Delivery', basePrice: 31, volatility: 0.043, drift: -0.0016, bearishFlavor: 'Food arrived cold. Delivery fee was hot.' },
  { ticker: 'DRUG', name: 'PharmaPump Inc', sector: 'Pharma', basePrice: 176, volatility: 0.033, drift: -0.0008, bearishFlavor: 'Raised insulin price 4,000%. Called it innovation.' },
  { ticker: 'RENT', name: 'RentSeek Realty', sector: 'PropTech', basePrice: 94, volatility: 0.028, drift: -0.001, bearishFlavor: 'Listed at $1,800/mo. Actually $2,600 after fees.' },
  { ticker: 'CELL', name: 'SignalDrop Wireless', sector: 'Telecom', basePrice: 119, volatility: 0.016, drift: -0.0005, bearishFlavor: '5G everywhere except where you are.' },
  { ticker: 'HVAC', name: 'HotAir Corp', sector: 'Media', basePrice: 142, volatility: 0.035, drift: -0.0012, bearishFlavor: 'CEO hasn\'t shown up in 3 weeks' },
  { ticker: 'PONZ', name: 'Ponzi Analytics', sector: 'Fintech', basePrice: 87, volatility: 0.045, drift: -0.002, bearishFlavor: 'Revenue consists entirely of vibes' },
  { ticker: 'BLMP', name: 'Blimpo Foods', sector: 'Consumer', basePrice: 34, volatility: 0.018, drift: 0.0003, bearishFlavor: 'FDA letter pending, execs very calm about it' },
  { ticker: 'MEME', name: 'MemeStocks Inc', sector: 'Retail', basePrice: 12, volatility: 0.055, drift: -0.0005, bearishFlavor: 'Entire strategy is "go viral"' },
  { ticker: 'ZNGR', name: 'Zinger Electric', sector: 'EV', basePrice: 218, volatility: 0.04, drift: -0.0008, bearishFlavor: 'Battery recall. Still pending. It\'s been 14 months.' },
  { ticker: 'FLFF', name: 'Flufferware', sector: 'SaaS', basePrice: 310, volatility: 0.03, drift: -0.001, bearishFlavor: 'A $300 app that does what Excel does for free' },
  { ticker: 'BRRR', name: 'MoneyPrinter Corp', sector: 'Fintech', basePrice: 56, volatility: 0.038, drift: -0.0015, bearishFlavor: 'Regulatory investigation #7 underway' },
  { ticker: 'CRNK', name: 'Crankshaw Media', sector: 'Media', basePrice: 78, volatility: 0.025, drift: -0.0007, bearishFlavor: 'Subscriber count revised down for the 4th time' },
  { ticker: 'SLOP', name: 'Slop.ai', sector: 'AI', basePrice: 445, volatility: 0.042, drift: -0.0018, bearishFlavor: 'Their "AI" is 40 interns in Mumbai' },
  { ticker: 'DREK', name: 'Drek Logistics', sector: 'Logistics', basePrice: 29, volatility: 0.022, drift: -0.0006, bearishFlavor: '93% of packages arrive "eventually"' },
  { ticker: 'GOBL', name: 'Gobbler Foods', sector: 'Consumer', basePrice: 61, volatility: 0.02, drift: -0.0004, bearishFlavor: 'The "natural ingredients" are very loosely defined' },
  { ticker: 'SMOG', name: 'SmogTech Industries', sector: 'Energy', basePrice: 95, volatility: 0.028, drift: -0.001, bearishFlavor: 'Carbon credits purchased from themselves' },
  { ticker: 'CRUD', name: 'Crudstone Mining', sector: 'Mining', basePrice: 18, volatility: 0.032, drift: -0.0009, bearishFlavor: 'Three separate SEC inquiries, zero explanations' },
  { ticker: 'FLOP', name: 'Floptimize', sector: 'SaaS', basePrice: 167, volatility: 0.033, drift: -0.0013, bearishFlavor: 'Net retention rate: 61%' },
  { ticker: 'YEET', name: 'Yeet Commerce', sector: 'E-Commerce', basePrice: 43, volatility: 0.048, drift: -0.002, bearishFlavor: 'Burn rate: $4M/month. Cash: $11M.' },
  { ticker: 'BOZO', name: 'Bozosoft', sector: 'Enterprise', basePrice: 185, volatility: 0.022, drift: -0.0005, bearishFlavor: 'Enterprise software from 1998, priced for 2025' },
  { ticker: 'GRFT', name: 'Grift Holdings', sector: 'Conglomerate', basePrice: 122, volatility: 0.037, drift: -0.0016, bearishFlavor: 'Board consists entirely of the CEO\'s golf buddies' },
  { ticker: 'DUMP', name: 'Dumpster Capital', sector: 'Finance', basePrice: 74, volatility: 0.041, drift: -0.0011, bearishFlavor: 'Rating agency calls it "fine, probably"' },
  { ticker: 'CRNG', name: 'Cringebook', sector: 'Social', basePrice: 238, volatility: 0.03, drift: -0.0009, bearishFlavor: 'Monthly active users are mostly bots' },
  { ticker: 'SPEW', name: 'SpewMedia Group', sector: 'Media', basePrice: 9, volatility: 0.05, drift: -0.0022, bearishFlavor: 'Revenue model: ???' },
  { ticker: 'FUDZ', name: 'Fudz Delivery', sector: 'Delivery', basePrice: 53, volatility: 0.035, drift: -0.0014, bearishFlavor: '"Path to profitability" has been 2 years away for 6 years' },
  { ticker: 'REKT', name: 'Rektalytics', sector: 'Data', basePrice: 390, volatility: 0.026, drift: -0.0007, bearishFlavor: 'Sells your data to whoever asks nicely' },
  { ticker: 'PUFF', name: 'PuffBrand Co', sector: 'Consumer', basePrice: 47, volatility: 0.024, drift: -0.0005, bearishFlavor: 'Marketing budget larger than R&D by 40x' },
  { ticker: 'BLEH', name: 'Bleh Pharma', sector: 'Pharma', basePrice: 134, volatility: 0.04, drift: -0.001, bearishFlavor: 'Phase 3 trial results: "mixed"' },
  { ticker: 'GLOP', name: 'Gloptech', sector: 'Hardware', basePrice: 82, volatility: 0.029, drift: -0.0008, bearishFlavor: 'Supply chain consists of wishes and prayers' },
  { ticker: 'DRGE', name: 'Dredge Retail', sector: 'Retail', basePrice: 27, volatility: 0.033, drift: -0.0012, bearishFlavor: 'Store count decreasing. Confidence: also decreasing.' },
  { ticker: 'NOPE', name: 'NopeCloud', sector: 'Cloud', basePrice: 176, volatility: 0.031, drift: -0.0009, bearishFlavor: '99.1% uptime, despite advertising 99.99%' },
  { ticker: 'BNKR', name: 'Bunkered Finance', sector: 'Banking', basePrice: 64, volatility: 0.019, drift: -0.0006, bearishFlavor: 'Derivative exposure: classified' },
  { ticker: 'WREK', name: 'Wreckonomics', sector: 'Consulting', basePrice: 112, volatility: 0.023, drift: -0.0007, bearishFlavor: 'Has never successfully completed a project on time' },
  { ticker: 'JNK', name: 'Junkyard Ventures', sector: 'VC', basePrice: 33, volatility: 0.044, drift: -0.002, bearishFlavor: 'Portfolio: 100% pre-revenue, 0% profitable' },
]

export const DURATION_OPTIONS: { value: Duration; label: string; days: number; shortLabel: string }[] = [
  { value: '1W', label: '1 Week', days: 7, shortLabel: '1W' },
  { value: '1M', label: '1 Month', days: 30, shortLabel: '1M' },
  { value: '3M', label: '3 Months', days: 90, shortLabel: '3M' },
]

export const TICK_INTERVAL_MS = 3000
export const DT = 0.077 // ~30 min in a 390-min trading day
export const MAX_PRICE_HISTORY = 100
