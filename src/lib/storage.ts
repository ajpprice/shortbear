import type { ShortPosition } from '../types'

const KEY = 'shortbear_positions'

export function loadPositions(): ShortPosition[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as ShortPosition[]) : []
  } catch {
    return []
  }
}

export function savePositions(positions: ShortPosition[]): void {
  localStorage.setItem(KEY, JSON.stringify(positions))
}

export function clearPositions(): void {
  localStorage.removeItem(KEY)
}
