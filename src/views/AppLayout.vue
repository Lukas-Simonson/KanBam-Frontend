<script setup lang="ts">
import { onMounted } from 'vue'
import { useWorkspaceStore } from '@/stores/workspace'
import AppSidebar from '@/components/shared/AppSidebar.vue'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/sidebar'

const workspaceStore = useWorkspaceStore()

onMounted(async () => {
  if (workspaceStore.workspaces.length === 0) {
    await workspaceStore.fetchWorkspaces()
  }
})
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header
        class="flex h-[66px] shrink-0 items-center gap-2 border-b-2 transition-[width,height] ease-linear"
        style="border-color: var(--color-border); background-color: var(--color-surface);"
      >
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
        </div>
      </header>
      <RouterView />
    </SidebarInset>
  </SidebarProvider>
</template>
