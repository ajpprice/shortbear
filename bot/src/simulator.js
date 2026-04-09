'use strict'

// Geometric Brownian Motion price simulator
// dt = ~30 min expressed as fraction of a trading day (390 min)
const DT = 0.077

function randomNormal() {
  const u1 = Math.random()
  const u2 = Math.random()
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

function nextPrice(currentPrice, volatility, drift) {
  const z = randomNormal()
  const logReturn = (drift - 0.5 * volatility * volatility) * DT + volatility * Math.sqrt(DT) * z
  return Math.max(currentPrice * Math.exp(logReturn), 0.01)
}

module.exports = { nextPrice }
