import { DT } from '../constants'

function randomNormal(): number {
  // Box-Muller transform
  const u1 = Math.random()
  const u2 = Math.random()
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

export function nextPrice(currentPrice: number, volatility: number, drift: number): number {
  const z = randomNormal()
  const logReturn = (drift - 0.5 * volatility * volatility) * DT + volatility * Math.sqrt(DT) * z
  return currentPrice * Math.exp(logReturn)
}
