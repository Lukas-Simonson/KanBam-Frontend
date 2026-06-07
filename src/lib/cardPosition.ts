import type { CardWithTags } from '@/lib/api'

// Insert a card between two existing positions
export function midpoint(a: number, b: number): number {
  return (a + b) / 2
}

// Compute the position for a card dropped at newIndex in a cards array
// The cards array should already reflect the new order (after vue-draggable-plus updates it)
export function computePosition(cards: CardWithTags[], newIndex: number): number {
  const prev = cards[newIndex - 1]
  const next = cards[newIndex + 1]

  if (!prev && !next) return 1
  if (!prev) return (next?.position ?? 1) - 1
  if (!next) return (prev?.position ?? 0) + 1
  return midpoint(prev.position, next.position)
}
