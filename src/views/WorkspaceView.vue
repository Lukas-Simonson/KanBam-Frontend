<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useWorkspaceStore } from '@/stores/workspace'

const route = useRoute()
const workspaceStore = useWorkspaceStore()
const workspaceId = route.params.workspaceId as string

onMounted(async () => {
  await Promise.all([
    workspaceStore.fetchWorkspace(workspaceId),
    workspaceStore.fetchMembers(workspaceId),
  ])
})
</script>

<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-black" style="color: var(--color-text);">
        {{ workspaceStore.activeWorkspace?.title ?? '...' }}
      </h1>
      <p v-if="workspaceStore.activeWorkspace?.description" class="text-sm font-bold mt-1" style="color: var(--color-text); opacity: 0.6;">
        {{ workspaceStore.activeWorkspace.description }}
      </p>
    </div>

    <!-- Boards grid — Phase 6 -->
    <div class="text-center py-24">
      <p class="text-4xl mb-4">🗂️</p>
      <p class="text-lg font-black" style="color: var(--color-text);">Boards coming in Phase 6</p>
    </div>
  </div>
</template>
