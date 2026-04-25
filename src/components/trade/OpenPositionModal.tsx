import { useState, useCallback } from 'react'
import type { Duration } from '../../types'
import { MOCK_STOCKS, DURATION_OPTIONS } from '../../constants'

interface OpenPositionModalProps {
  onOpen: (ticker: string, duration: Duration, margin: number, receipt: string) => void
  onClose: () => void
  existingTickers: string[]
}

type Step = 'company' | 'receipt' | 'duration' | 'margin' | 'confirm'
const STEPS: Step[] = ['company', 'receipt', 'duration', 'margin', 'confirm']

export function OpenPositionModal({ onOpen, onClose, existingTickers }: OpenPositionModalProps) {
  const [step, setStep] = useState<Step>('company')
  const [search, setSearch] = useState('')
  const [selectedTicker, setSelectedTicker] = useState('')
  const [selectedDuration, setSelectedDuration] = useState<Duration>('1W')
  const [marginInput, setMarginInput] = useState('')
  const [receipt, setReceipt] = useState('')

  const stock = MOCK_STOCKS.find(s => s.ticker === selectedTicker)
  const durationConfig = DURATION_OPTIONS.find(d => d.value === selectedDuration)!
  const margin = parseFloat(marginInput) || 0
  const shares = stock ? margin / stock.basePrice : 0
  const stopLossPrice = stock ? stock.basePrice * 2 : 0
  const maxProfit = stock ? stock.basePrice * shares : 0

  const filteredStocks = MOCK_STOCKS.filter(s =>
    !search ||
    s.ticker.toLowerCase().includes(search.toLowerCase()) ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.sector.toLowerCase().includes(search.toLowerCase())
  )

  const handleBackdrop = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }, [onClose])

  const handleSubmit = () => {
    if (!stock || !margin || margin <= 0 || !receipt.trim()) return
    onOpen(selectedTicker, selectedDuration, margin, receipt.trim())
    onClose()
  }

  const expiryDate = new Date(Date.now() + durationConfig.days * 86400000).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  const canAdvance =
    (step === 'receipt' && receipt.trim().length >= 10) ||
    (step === 'duration') ||
    (step === 'margin' && margin > 0) ||
    (step === 'confirm')

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] flex flex-col shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="font-bold text-xl text-gray-900">Write Your Review</h2>
            <div className="flex gap-1 mt-2">
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  className={`h-1 rounded-full transition-all ${
                    step === s ? 'w-6 bg-bear-teal' :
                    STEPS.indexOf(step) > i
                      ? 'w-3 bg-bear-tealLight' : 'w-3 bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">

          {/* Step 1: Company */}
          {step === 'company' && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Who wronged you? Pick the company.</p>
              <input
                type="text"
                placeholder="Search by name, ticker, or sector…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-bear-teal mb-3"
                autoFocus
              />
              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {filteredStocks.map(s => (
                  <button
                    key={s.ticker}
                    onClick={() => { setSelectedTicker(s.ticker); setStep('receipt') }}
                    className={`w-full text-left rounded-xl px-4 py-3 transition-colors border ${
                      selectedTicker === s.ticker
                        ? 'border-bear-teal bg-bear-tealPale'
                        : 'border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">{s.ticker}</span>
                        <span className="text-xs text-gray-400 px-1.5 py-0.5 bg-gray-100 rounded">{s.sector}</span>
                        {existingTickers.includes(s.ticker) && (
                          <span className="text-xs text-bear-tealDark px-1.5 py-0.5 bg-bear-tealPale rounded">open</span>
                        )}
                      </div>
                      <span className="font-semibold text-gray-700 tabular-nums text-sm">${s.basePrice.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{s.name}</p>
                    <p className="text-xs text-gray-500 italic mt-0.5">{s.bearishFlavor}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Receipt */}
          {step === 'receipt' && stock && (
            <div>
              <div className="flex items-center gap-2 mb-4 p-3 bg-bear-tealPale rounded-xl">
                <span className="font-bold text-bear-tealDark">{stock.ticker}</span>
                <span className="text-gray-500 text-sm">{stock.name}</span>
                <span className="ml-auto font-semibold text-gray-700">${stock.basePrice.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500 mb-1">What's your beef with {stock.name}?</p>
              <p className="text-xs text-gray-400 mb-3">This is your receipt. It gets attached to the position. Don't just rant — back it.</p>
              <textarea
                value={receipt}
                onChange={e => setReceipt(e.target.value.slice(0, 280))}
                placeholder={stock.bearishFlavor}
                rows={4}
                className="w-full border-2 border-gray-200 focus:border-bear-teal rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors resize-none"
                autoFocus
              />
              <div className="flex justify-between text-xs mt-1.5">
                <span className={receipt.trim().length < 10 ? 'text-gray-400' : 'text-bear-tealDark'}>
                  {receipt.trim().length < 10 ? `${10 - receipt.trim().length} more chars` : '✓ Receipt ready'}
                </span>
                <span className="text-gray-400">{receipt.length}/280</span>
              </div>
              <button
                onClick={() => setReceipt(stock.bearishFlavor)}
                className="mt-3 text-xs text-bear-tealDark hover:underline"
              >
                Use suggestion ↑
              </button>
            </div>
          )}

          {/* Step 3: Duration */}
          {step === 'duration' && stock && (
            <div>
              <div className="flex items-center gap-2 mb-4 p-3 bg-bear-tealPale rounded-xl">
                <span className="font-bold text-bear-tealDark">{stock.ticker}</span>
                <span className="text-gray-500 text-sm">{stock.name}</span>
                <span className="ml-auto font-semibold text-gray-700">${stock.basePrice.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">How long do you want to hold the short?</p>
              <div className="grid grid-cols-3 gap-3">
                {DURATION_OPTIONS.map(d => (
                  <button
                    key={d.value}
                    onClick={() => setSelectedDuration(d.value)}
                    className={`rounded-xl py-4 font-bold text-lg transition-colors border-2 ${
                      selectedDuration === d.value
                        ? 'border-bear-teal bg-bear-teal text-white'
                        : 'border-gray-200 text-gray-700 hover:border-bear-tealLight'
                    }`}
                  >
                    {d.shortLabel}
                    <p className="text-xs font-normal mt-0.5 opacity-70">{d.label}</p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center mt-4">
                Position expires: <strong className="text-gray-600">{expiryDate}</strong>
              </p>
            </div>
          )}

          {/* Step 4: Margin */}
          {step === 'margin' && stock && (
            <div>
              <div className="flex items-center justify-between mb-4 p-3 bg-bear-tealPale rounded-xl">
                <div>
                  <span className="font-bold text-bear-tealDark">{stock.ticker}</span>
                  <span className="text-gray-500 text-sm ml-2">{durationConfig.label}</span>
                </div>
                <span className="font-semibold text-gray-700">${stock.basePrice.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                How much are you willing to lose at most? This is your <strong>maximum risk</strong> — we auto-close if you hit it.
              </p>
              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                <input
                  type="number"
                  min="1"
                  step="5"
                  placeholder="100"
                  value={marginInput}
                  onChange={e => setMarginInput(e.target.value)}
                  className="w-full border-2 border-gray-200 focus:border-bear-teal rounded-xl pl-8 pr-4 py-3 text-xl font-bold focus:outline-none transition-colors"
                  autoFocus
                />
              </div>

              {/* Quick picks */}
              <div className="flex gap-2 mb-5">
                {[25, 50, 100, 250].map(v => (
                  <button
                    key={v}
                    onClick={() => setMarginInput(String(v))}
                    className={`flex-1 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                      parseFloat(marginInput) === v
                        ? 'border-bear-teal bg-bear-teal text-white'
                        : 'border-gray-200 text-gray-600 hover:border-bear-tealLight'
                    }`}
                  >
                    ${v}
                  </button>
                ))}
              </div>

              {margin > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shares shorted</span>
                    <span className="font-semibold">{shares.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Entry price</span>
                    <span className="font-semibold">${stock.basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-red-500">
                    <span>Auto-close triggers at</span>
                    <span className="font-bold">${stopLossPrice.toFixed(2)} (+100%)</span>
                  </div>
                  <div className="flex justify-between text-bear-tealDark">
                    <span>Max profit (stock → $0)</span>
                    <span className="font-bold">+${maxProfit.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                    <span>Max loss</span>
                    <span className="text-red-500">-${margin.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Confirm */}
          {step === 'confirm' && stock && (
            <div className="text-center py-4">
              <div className="text-6xl mb-4">🐻</div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">File this review on {stock.ticker}?</h3>
              <p className="text-gray-500 text-sm mb-5 italic">"{receipt}"</p>
              <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2.5 text-sm mb-6">
                <div className="flex justify-between"><span className="text-gray-500">Company</span><span className="font-semibold">{stock.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Entry price</span><span className="font-semibold">${stock.basePrice.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Shares</span><span className="font-semibold">{shares.toFixed(4)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-semibold">{durationConfig.label}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Expires</span><span className="font-semibold">{expiryDate}</span></div>
                <div className="flex justify-between text-red-500 border-t border-gray-200 pt-2"><span>Stop loss at</span><span className="font-bold">${stopLossPrice.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-red-500"><span>Max loss</span><span>-${margin.toFixed(2)}</span></div>
              </div>
              <p className="text-xs text-gray-400 mb-4">Simulated trading. No real money — yet.</p>
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="px-6 pb-6 pt-3 border-t border-gray-100 flex gap-3 flex-shrink-0">
          {step !== 'company' && (
            <button
              onClick={() => {
                const idx = STEPS.indexOf(step)
                setStep(STEPS[idx - 1])
              }}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-600 hover:border-gray-300 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (step === 'company') return
              if (step === 'confirm') { handleSubmit(); return }
              if (!canAdvance) return
              const idx = STEPS.indexOf(step)
              setStep(STEPS[idx + 1])
            }}
            disabled={step === 'company' || !canAdvance}
            className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
              step === 'company' || !canAdvance
                ? 'bg-gray-100 text-gray-400 cursor-default'
                : 'bg-bear-teal text-white hover:bg-bear-tealDark active:scale-[0.98]'
            }`}
          >
            {step === 'confirm' ? '🐻 File the review' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}
