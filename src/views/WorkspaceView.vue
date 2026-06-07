<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useWorkspaceStore } from '@/stores/workspace'
import { useBoardStore } from '@/stores/board'
import BoardCard from '@/components/board/BoardCard.vue'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/dialog'

const route = useRoute()
const workspaceStore = useWorkspaceStore()
const boardStore = useBoardStore()
const workspaceId = route.params.workspaceId as string

const showArchived = ref(false)
const dialogOpen = ref(false)
const newTitle = ref('')
const newPrefix = ref('')
const newDescription = ref('')
const prefixError = ref('')
const generalError = ref('')

const visibleBoards = computed(() =>
  showArchived.value
    ? boardStore.boards
    : boardStore.boards.filter(b => !b.isArchived)
)

onMounted(async () => {
  await Promise.all([
    workspaceStore.fetchWorkspace(workspaceId),
    workspaceStore.fetchMembers(workspaceId),
    boardStore.fetchBoards(workspaceId),
  ])
})

async function handleCreate() {
  prefixError.value = ''
  generalError.value = ''
  try {
    await boardStore.createBoard(workspaceId, {
      title: newTitle.value,
      prefix: newPrefix.value.toUpperCase(),
      description: newDescription.value || undefined,
    })
    dialogOpen.value = false
    newTitle.value = ''
    newPrefix.value = ''
    newDescription.value = ''
  } catch (error) {
    const code = (error as { response?: { data?: { code?: string } } }).response?.data?.code
    if (code === 'BOARD_PREFIX_TAKEN') {
      prefixError.value = 'This prefix is already in use in this workspace.'
    } else {
      generalError.value = 'An unexpected error occurred.'
    }
  }
}

function resetDialog() {
  newTitle.value = ''
  newPrefix.value = ''
  newDescription.value = ''
  prefixError.value = ''
  generalError.value = ''
}
</script>

<template>
  <div class="p-8">
    <!-- Page header -->
    <div class="flex items-start justify-between mb-8">
      <div>
        <h1 class="text-3xl font-black" style="color: var(--color-text);">
          {{ workspaceStore.activeWorkspace?.title ?? '...' }}
        </h1>
        <p v-if="workspaceStore.activeWorkspace?.description" class="text-sm font-bold mt-1" style="color: var(--color-text); opacity: 0.6;">
          {{ workspaceStore.activeWorkspace.description }}
        </p>
      </div>
      <div class="flex items-center gap-3">
        <Button variant="neutral" @click="showArchived = !showArchived">
          {{ showArchived ? 'Hide archived' : 'Show archived' }}
        </Button>
        <Button @click="dialogOpen = true">+ New Board</Button>
      </div>
    </div>

    <!-- Boards grid -->
    <div v-if="visibleBoards.length === 0" class="text-center py-24">
      <p class="text-4xl mb-4">🗂️</p>
      <p class="text-lg font-black" style="color: var(--color-text);">
        {{ boardStore.boards.length === 0 ? 'No boards yet' : 'No boards to show' }}
      </p>
      <p class="text-sm font-bold mt-1" style="color: var(--color-text); opacity: 0.5;">
        {{ boardStore.boards.length === 0 ? 'Create one to get started' : 'Toggle archived boards to see hidden boards' }}
      </p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <BoardCard
        v-for="board in visibleBoards"
        :key="board.id"
        :board="board"
      />
    </div>

    <!-- Create board dialog -->
    <Dialog v-model:open="dialogOpen" @update:open="(open) => { if (!open) resetDialog() }">
      <DialogContent>
        <DialogHeader>
          <DialogTitle class="text-xl font-black tracking-tight">New Board</DialogTitle>
          <DialogDescription>Create a new board in this workspace.</DialogDescription>
        </DialogHeader>

        <form @submit.prevent="handleCreate" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-bold text-foreground">Title</label>
            <Input v-model="newTitle" type="text" placeholder="My Board" required />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-bold text-foreground">Prefix</label>
            <Input
              v-model="newPrefix"
              type="text"
              placeholder="e.g. PROJ"
              minlength="3"
              required
              @input="newPrefix = (newPrefix).toUpperCase()"
            />
            <p class="text-xs opacity-50" style="color: var(--color-text);">
              Min 3 characters. Used for card IDs like PROJ-1.
            </p>
            <p v-if="prefixError" class="text-sm font-bold" style="color: var(--color-accent);">
              {{ prefixError }}
            </p>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-bold text-foreground">Description (optional)</label>
            <Input v-model="newDescription" type="text" placeholder="What is this board for?" />
          </div>

          <p v-if="generalError" class="text-sm font-bold" style="color: var(--color-accent);">
            {{ generalError }}
          </p>

          <DialogFooter>
            <Button variant="neutral" type="button" @click="dialogOpen = false">Cancel</Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
