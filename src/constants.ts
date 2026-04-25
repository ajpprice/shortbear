import type { MockStock, Duration } from './types'

// Real Kraken xStocks tickers. Traded as CMCSAx, METAx, etc.
// Curated for hateability — every name has a public-facing reason people are mad.
export const MOCK_STOCKS: MockStock[] = [
  { ticker: 'CMCSA', name: 'Comcast',          sector: 'Telecom',  basePrice: 36,  volatility: 0.020, drift: -0.0010, bearishFlavor: '7-hour install window. Tech showed up Tuesday. It is now Friday.' },
  { ticker: 'META',  name: 'Meta Platforms',   sector: 'Social',   basePrice: 588, volatility: 0.028, drift: -0.0008, bearishFlavor: 'Sold my data. Showed me ads for the data they sold.' },
  { ticker: 'TSLA',  name: 'Tesla',            sector: 'EV',       basePrice: 348, volatility: 0.045, drift: -0.0015, bearishFlavor: 'Panel gaps wider than the political divide.' },
  { ticker: 'BAC',   name: 'Bank of America',  sector: 'Banking',  basePrice: 47,  volatility: 0.022, drift: -0.0009, bearishFlavor: 'Charged $35 for being $2 short. The $2 was their fee.' },
  { ticker: 'GME',   name: 'GameStop',         sector: 'Retail',   basePrice: 28,  volatility: 0.060, drift: -0.0020, bearishFlavor: 'Trade-in value: 7 cents. Resale price: $59.99.' },
  { ticker: 'HOOD',  name: 'Robinhood',        sector: 'Fintech',  basePrice: 38,  volatility: 0.052, drift: -0.0014, bearishFlavor: 'Halted buying when you were finally winning.' },
  { ticker: 'NFLX',  name: 'Netflix',          sector: 'Streaming',basePrice: 902, volatility: 0.030, drift: -0.0007, bearishFlavor: 'Cancelled your favorite show after one season. Again.' },
  { ticker: 'PFE',   name: 'Pfizer',           sector: 'Pharma',   basePrice: 26,  volatility: 0.024, drift: -0.0011, bearishFlavor: 'Drug costs $1,200 in the US. $19 in Canada. Same factory.' },
  { ticker: 'PM',    name: 'Philip Morris',    sector: 'Tobacco',  basePrice: 132, volatility: 0.020, drift: -0.0008, bearishFlavor: 'Literally sells cancer.' },
  { ticker: 'XOM',   name: 'Exxon Mobil',      sector: 'Energy',   basePrice: 109, volatility: 0.022, drift: -0.0012, bearishFlavor: 'Knew about climate change in 1977. Funded denial in 1989.' },
  { ticker: 'MCD',   name: "McDonald's",       sector: 'QSR',      basePrice: 296, volatility: 0.018, drift: -0.0006, bearishFlavor: 'The ice cream machine is "broken" again.' },
  { ticker: 'WMT',   name: 'Walmart',          sector: 'Retail',   basePrice: 95,  volatility: 0.018, drift: -0.0005, bearishFlavor: 'Killed every small business within 30 miles.' },
  { ticker: 'COIN',  name: 'Coinbase',         sector: 'Crypto',   basePrice: 257, volatility: 0.055, drift: -0.0013, bearishFlavor: 'Withdrawal pending: 6 weeks. Support response: never.' },
  { ticker: 'MSTR',  name: 'Strategy',         sector: 'Crypto',   basePrice: 281, volatility: 0.070, drift: -0.0018, bearishFlavor: 'Software company that buys Bitcoin instead of writing software.' },
  { ticker: 'INTC',  name: 'Intel',            sector: 'Semis',    basePrice: 23,  volatility: 0.038, drift: -0.0017, bearishFlavor: 'Spent 4 years losing to a company half its size.' },
  { ticker: 'ORCL',  name: 'Oracle',           sector: 'Software', basePrice: 191, volatility: 0.025, drift: -0.0006, bearishFlavor: 'Audit you for using software you bought from them.' },
  { ticker: 'IBM',   name: 'IBM',              sector: 'Enterprise',basePrice:248, volatility: 0.022, drift: -0.0008, bearishFlavor: '3 strategic transformations since 2014. None worked.' },
  { ticker: 'KO',    name: 'Coca-Cola',        sector: 'Consumer', basePrice: 71,  volatility: 0.014, drift: -0.0004, bearishFlavor: 'Top global plastic polluter, 6 years running.' },
  { ticker: 'PEP',   name: 'PepsiCo',          sector: 'Consumer', basePrice: 152, volatility: 0.015, drift: -0.0005, bearishFlavor: 'Shrunk the chips. Kept the bag the same. Charged more.' },
  { ticker: 'AAPL',  name: 'Apple',            sector: 'Hardware', basePrice: 232, volatility: 0.022, drift: -0.0004, bearishFlavor: '$1,200 phone. Won\'t fix it. "You should buy a new one."' },
  { ticker: 'GOOGL', name: 'Alphabet',         sector: 'AdTech',   basePrice: 184, volatility: 0.024, drift: -0.0005, bearishFlavor: 'Killed your favorite product. Then killed its replacement.' },
  { ticker: 'MSFT',  name: 'Microsoft',        sector: 'Software', basePrice: 437, volatility: 0.020, drift: -0.0004, bearishFlavor: 'Put ads in the Start menu. Of an OS you paid for.' },
  { ticker: 'AMZN',  name: 'Amazon',           sector: 'E-Commerce',basePrice:218, volatility: 0.026, drift: -0.0006, bearishFlavor: 'Same-day delivery. Counterfeit product. No human to call.' },
  { ticker: 'JPM',   name: 'JPMorgan Chase',   sector: 'Banking',  basePrice: 244, volatility: 0.022, drift: -0.0007, bearishFlavor: 'Settled with regulators 11 times since 2020. Stock went up.' },
  { ticker: 'GS',    name: 'Goldman Sachs',    sector: 'Banking',  basePrice: 583, volatility: 0.024, drift: -0.0008, bearishFlavor: 'The vampire squid still has its blood funnel attached.' },
  { ticker: 'CRM',   name: 'Salesforce',       sector: 'SaaS',     basePrice: 339, volatility: 0.026, drift: -0.0007, bearishFlavor: '$300/seat for software your sales team refuses to use.' },
  { ticker: 'PLTR',  name: 'Palantir',         sector: 'Defense',  basePrice: 78,  volatility: 0.058, drift: -0.0014, bearishFlavor: 'Government surveillance, branded.' },
  { ticker: 'SPY',   name: 'S&P 500 ETF',      sector: 'Index',    basePrice: 591, volatility: 0.012, drift: -0.0003, bearishFlavor: 'Bet against the entire American economy. Dramatic.' },
  { ticker: 'QQQ',   name: 'Nasdaq-100 ETF',   sector: 'Index',    basePrice: 521, volatility: 0.016, drift: -0.0005, bearishFlavor: 'Bet against the entire tech bubble. Patriotic, in a way.' },
]

export const DURATION_OPTIONS: { value: Duration; label: string; days: number; shortLabel: string }[] = [
  { value: '1W', label: '1 Week', days: 7, shortLabel: '1W' },
  { value: '1M', label: '1 Month', days: 30, shortLabel: '1M' },
  { value: '3M', label: '3 Months', days: 90, shortLabel: '3M' },
]

export const TICK_INTERVAL_MS = 3000
export const DT = 0.077
export const MAX_PRICE_HISTORY = 100
