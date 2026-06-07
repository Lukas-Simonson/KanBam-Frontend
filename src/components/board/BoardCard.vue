<script setup lang="ts">
import type { Board } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/card'

defineProps<{
  board: Board
}>()
</script>

<template>
  <RouterLink :to="`/workspaces/${board.workspaceID}/boards/${board.id}`" class="block no-underline">
    <Card
      class="h-full cursor-pointer transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px]"
      :style="board.isArchived ? 'opacity: 0.6;' : ''"
    >
      <CardHeader>
        <div class="flex items-start justify-between gap-2">
          <CardTitle class="text-xl font-black tracking-tight">{{ board.title }}</CardTitle>
          <span
            class="px-2 py-0.5 border-2 text-xs font-black shrink-0"
            style="border-color: var(--color-border); background-color: var(--color-bg); color: var(--color-text);"
          >
            {{ board.prefix }}
          </span>
        </div>
        <CardDescription v-if="board.description">{{ board.description }}</CardDescription>
        <CardDescription v-else class="italic opacity-50">No description</CardDescription>
      </CardHeader>
      <CardContent class="flex items-center gap-2">
        <span
          v-if="board.isArchived"
          class="px-2 py-0.5 border-2 text-xs font-bold"
          style="border-color: var(--color-border); color: var(--color-text); opacity: 0.6;"
        >
          Archived
        </span>
        <span class="text-xs font-bold uppercase tracking-widest opacity-40" style="color: var(--color-text);">
          Open board →
        </span>
      </CardContent>
    </Card>
  </RouterLink>
</template>
