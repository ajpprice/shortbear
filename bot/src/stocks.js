'use strict'

// Real Kraken xStocks tickers. Traded as CMCSAx, METAx, etc.
// Curated for hateability — every name has a public-facing reason people are mad.
const STOCKS = [
  { ticker: 'CMCSA', name: 'Comcast',          sector: 'Telecom',    basePrice: 36,  volatility: 0.020, drift: -0.0010, flavor: '7-hour install window. Tech showed up Tuesday. It is now Friday.' },
  { ticker: 'META',  name: 'Meta Platforms',   sector: 'Social',     basePrice: 588, volatility: 0.028, drift: -0.0008, flavor: 'Sold my data. Showed me ads for the data they sold.' },
  { ticker: 'TSLA',  name: 'Tesla',            sector: 'EV',         basePrice: 348, volatility: 0.045, drift: -0.0015, flavor: 'Panel gaps wider than the political divide.' },
  { ticker: 'BAC',   name: 'Bank of America',  sector: 'Banking',    basePrice: 47,  volatility: 0.022, drift: -0.0009, flavor: 'Charged $35 for being $2 short. The $2 was their fee.' },
  { ticker: 'GME',   name: 'GameStop',         sector: 'Retail',     basePrice: 28,  volatility: 0.060, drift: -0.0020, flavor: 'Trade-in value: 7 cents. Resale price: $59.99.' },
  { ticker: 'HOOD',  name: 'Robinhood',        sector: 'Fintech',    basePrice: 38,  volatility: 0.052, drift: -0.0014, flavor: 'Halted buying when you were finally winning.' },
  { ticker: 'NFLX',  name: 'Netflix',          sector: 'Streaming',  basePrice: 902, volatility: 0.030, drift: -0.0007, flavor: 'Cancelled your favorite show after one season. Again.' },
  { ticker: 'PFE',   name: 'Pfizer',           sector: 'Pharma',     basePrice: 26,  volatility: 0.024, drift: -0.0011, flavor: 'Drug costs $1,200 in the US. $19 in Canada. Same factory.' },
  { ticker: 'PM',    name: 'Philip Morris',    sector: 'Tobacco',    basePrice: 132, volatility: 0.020, drift: -0.0008, flavor: 'Literally sells cancer.' },
  { ticker: 'XOM',   name: 'Exxon Mobil',      sector: 'Energy',     basePrice: 109, volatility: 0.022, drift: -0.0012, flavor: 'Knew about climate change in 1977. Funded denial in 1989.' },
  { ticker: 'MCD',   name: "McDonald's",       sector: 'QSR',        basePrice: 296, volatility: 0.018, drift: -0.0006, flavor: 'The ice cream machine is "broken" again.' },
  { ticker: 'WMT',   name: 'Walmart',          sector: 'Retail',     basePrice: 95,  volatility: 0.018, drift: -0.0005, flavor: 'Killed every small business within 30 miles.' },
  { ticker: 'COIN',  name: 'Coinbase',         sector: 'Crypto',     basePrice: 257, volatility: 0.055, drift: -0.0013, flavor: 'Withdrawal pending: 6 weeks. Support response: never.' },
  { ticker: 'MSTR',  name: 'Strategy',         sector: 'Crypto',     basePrice: 281, volatility: 0.070, drift: -0.0018, flavor: 'Software company that buys Bitcoin instead of writing software.' },
  { ticker: 'INTC',  name: 'Intel',            sector: 'Semis',      basePrice: 23,  volatility: 0.038, drift: -0.0017, flavor: 'Spent 4 years losing to a company half its size.' },
  { ticker: 'ORCL',  name: 'Oracle',           sector: 'Software',   basePrice: 191, volatility: 0.025, drift: -0.0006, flavor: 'Audit you for using software you bought from them.' },
  { ticker: 'IBM',   name: 'IBM',              sector: 'Enterprise', basePrice: 248, volatility: 0.022, drift: -0.0008, flavor: '3 strategic transformations since 2014. None worked.' },
  { ticker: 'KO',    name: 'Coca-Cola',        sector: 'Consumer',   basePrice: 71,  volatility: 0.014, drift: -0.0004, flavor: 'Top global plastic polluter, 6 years running.' },
  { ticker: 'PEP',   name: 'PepsiCo',          sector: 'Consumer',   basePrice: 152, volatility: 0.015, drift: -0.0005, flavor: 'Shrunk the chips. Kept the bag the same. Charged more.' },
  { ticker: 'AAPL',  name: 'Apple',            sector: 'Hardware',   basePrice: 232, volatility: 0.022, drift: -0.0004, flavor: '$1,200 phone. Won\'t fix it. "You should buy a new one."' },
  { ticker: 'GOOGL', name: 'Alphabet',         sector: 'AdTech',     basePrice: 184, volatility: 0.024, drift: -0.0005, flavor: 'Killed your favorite product. Then killed its replacement.' },
  { ticker: 'MSFT',  name: 'Microsoft',        sector: 'Software',   basePrice: 437, volatility: 0.020, drift: -0.0004, flavor: 'Put ads in the Start menu. Of an OS you paid for.' },
  { ticker: 'AMZN',  name: 'Amazon',           sector: 'E-Commerce', basePrice: 218, volatility: 0.026, drift: -0.0006, flavor: 'Same-day delivery. Counterfeit product. No human to call.' },
  { ticker: 'JPM',   name: 'JPMorgan Chase',   sector: 'Banking',    basePrice: 244, volatility: 0.022, drift: -0.0007, flavor: 'Settled with regulators 11 times since 2020. Stock went up.' },
  { ticker: 'GS',    name: 'Goldman Sachs',    sector: 'Banking',    basePrice: 583, volatility: 0.024, drift: -0.0008, flavor: 'The vampire squid still has its blood funnel attached.' },
  { ticker: 'CRM',   name: 'Salesforce',       sector: 'SaaS',       basePrice: 339, volatility: 0.026, drift: -0.0007, flavor: '$300/seat for software your sales team refuses to use.' },
  { ticker: 'PLTR',  name: 'Palantir',         sector: 'Defense',    basePrice: 78,  volatility: 0.058, drift: -0.0014, flavor: 'Government surveillance, branded.' },
  { ticker: 'SPY',   name: 'S&P 500 ETF',      sector: 'Index',      basePrice: 591, volatility: 0.012, drift: -0.0003, flavor: 'Bet against the entire American economy. Dramatic.' },
  { ticker: 'QQQ',   name: 'Nasdaq-100 ETF',   sector: 'Index',      basePrice: 521, volatility: 0.016, drift: -0.0005, flavor: 'Bet against the entire tech bubble. Patriotic, in a way.' },
]

function getStock(ticker) {
  return STOCKS.find(s => s.ticker === ticker)
}

module.exports = { STOCKS, getStock }
