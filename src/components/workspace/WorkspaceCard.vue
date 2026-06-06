<script setup lang="ts">
import type { Workspace } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/card'

const props = defineProps<{
  workspace: Workspace
}>()
</script>

<template>
  <RouterLink :to="`/workspaces/${workspace.id}`" class="block no-underline">
    <Card class="h-full transition-translate cursor-pointer hover:-translate-x-[2px] hover:-translate-y-[2px]">
      <CardHeader>
        <CardTitle class="text-xl font-black tracking-tight">{{ workspace.title }}</CardTitle>
        <CardDescription v-if="workspace.description" class="text-sm mt-1">
          {{ workspace.description }}
        </CardDescription>
        <CardDescription v-else class="text-sm mt-1 italic opacity-50">
          No description
        </CardDescription>
      </CardHeader>
      <CardContent class="flex items-center justify-between pt-0">
        <span class="text-xs font-bold uppercase tracking-widest opacity-40">
          Open workspace →
        </span>
      </CardContent>
    </Card>
  </RouterLink>
</template>
