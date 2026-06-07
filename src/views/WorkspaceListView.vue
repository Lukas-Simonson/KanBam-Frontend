<script setup lang="ts">
import { ref } from 'vue'
import { useWorkspaceStore } from '@/stores/workspace'
import WorkspaceCard from '@/components/workspace/WorkspaceCard.vue'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/dialog'

const workspaceStore = useWorkspaceStore()

const dialogOpen = ref(false)
const newTitle = ref('')
const newDescription = ref('')
const errorMessage = ref('')

async function handleCreate() {
  try {
    await workspaceStore.createWorkspace({ title: newTitle.value, description: newDescription.value })
    dialogOpen.value = false
    newTitle.value = ''
    newDescription.value = ''
    errorMessage.value = ''
  } catch {
    errorMessage.value = 'An unexpected error occurred'
  }
}
</script>

<template>
  <div class="p-8">
    <!-- Page header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-black" style="color: var(--color-text)">Workspaces</h1>
        <p class="text-sm font-bold mt-1" style="color: var(--color-text); opacity: 0.6">
          Your shared spaces for projects and teams
        </p>
      </div>
      <Button @click="dialogOpen = true">+ New Workspace</Button>
    </div>

    <!-- Workspace grid -->
    <div v-if="workspaceStore.workspaces.length === 0" class="text-center py-24">
      <p class="text-4xl mb-4">📋</p>
      <p class="text-lg font-black" style="color: var(--color-text)">No workspaces yet</p>
      <p class="text-sm font-bold mt-1" style="color: var(--color-text); opacity: 0.5">
        Create one to get started
      </p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <WorkspaceCard v-for="workspace in workspaceStore.workspaces" :key="workspace.id" :workspace="workspace" />
    </div>

    <!-- Create workspace dialog -->
    <Dialog v-model:open="dialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle class="text-xl font-black tracking-tight">New Workspace</DialogTitle>
          <DialogDescription>Create a shared space for your project or team.</DialogDescription>
        </DialogHeader>

        <form @submit.prevent="handleCreate" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-bold text-foreground">Title</label>
            <Input v-model="newTitle" type="text" placeholder="My Workspace" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-bold text-foreground">Description (optional)</label>
            <Input v-model="newDescription" type="text" placeholder="What is this workspace for?" />
          </div>
          <div
            v-if="errorMessage"
            class="px-3 py-2 border-2 text-sm font-bold"
            style="border-color: var(--color-border); background-color: var(--color-accent); color: var(--color-accent-text);"
          >
            {{ errorMessage }}
          </div>

          <DialogFooter>
            <Button variant="neutral" type="button" @click="dialogOpen = false">Cancel</Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
