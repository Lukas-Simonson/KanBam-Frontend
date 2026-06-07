<script setup lang="ts">
import type { Tag } from '@/lib/api'

defineProps<{
  tag: Tag
}>()

// Returns black or white depending on which contrasts better with the given hex color
function contrastColor(hex: string | undefined): string {
  if (!hex) return 'var(--color-text)'
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  // Perceived luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#0a0a0a' : '#ffffff'
}
</script>

<template>
  <span
    class="inline-flex items-center px-2 py-0.5 border-2 text-xs font-bold"
    :style="{
      backgroundColor: tag.color ?? 'var(--color-surface)',
      borderColor: 'var(--color-border)',
      color: contrastColor(tag.color),
    }"
  >
    {{ tag.name }}
  </span>
</template>
