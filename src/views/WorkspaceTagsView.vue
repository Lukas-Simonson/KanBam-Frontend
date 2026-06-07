<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTagStore } from '@/stores/tag'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/dialog'
import TagBadge from '@/components/shared/TagBadge.vue'
import type { Tag } from '@/lib/api'

const route = useRoute()
const tagStore = useTagStore()
const workspaceId = route.params.workspaceId as string

// Create form
const newName = ref('')
const newColor = ref('#4899FF')
const createError = ref('')

// Edit state — stores the tag currently being edited and its draft values
const editingId = ref<string | null>(null)
const editName = ref('')
const editColor = ref('')

// Delete confirmation
const deleteDialogOpen = ref(false)
const tagToDelete = ref<Tag | null>(null)

onMounted(async () => {
  await tagStore.fetchTags(workspaceId)
})

async function handleCreate() {
  createError.value = ''
  try {
    await tagStore.createTag(workspaceId, {
      name: newName.value,
      color: newColor.value,
    })
    newName.value = ''
    newColor.value = '#4899FF'
  } catch (error) {
    const code = (error as { response?: { data?: { code?: string } } }).response?.data?.code
    if (code === 'TAG_NAME_TAKEN') {
      createError.value = 'A tag with this name already exists in this workspace.'
    } else {
      createError.value = 'An unexpected error occurred.'
    }
  }
}

function startEdit(tag: Tag) {
  editingId.value = tag.id
  editName.value = tag.name
  editColor.value = tag.color ?? '#4899FF'
}

function cancelEdit() {
  editingId.value = null
}

async function handleSaveEdit(tag: Tag) {
  await tagStore.updateTag(tag.id, {
    name: editName.value,
    color: editColor.value,
  })
  editingId.value = null
}

function confirmDelete(tag: Tag) {
  tagToDelete.value = tag
  deleteDialogOpen.value = true
}

async function handleDelete() {
  if (!tagToDelete.value) return
  await tagStore.deleteTag(tagToDelete.value.id)
  deleteDialogOpen.value = false
  tagToDelete.value = null
}
</script>

<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-black" style="color: var(--color-text);">Tags</h1>
      <p class="text-sm font-bold mt-1" style="color: var(--color-text); opacity: 0.6;">
        Workspace-level tags available across all boards.
      </p>
    </div>

    <div class="flex flex-col gap-8 max-w-2xl">

      <!-- Tag list -->
      <Card>
        <CardHeader>
          <CardTitle>Existing Tags</CardTitle>
          <CardDescription>Click a tag to edit its name or color.</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-2">

          <div v-if="tagStore.tags.length === 0" class="text-center py-8">
            <p class="text-sm font-bold opacity-50" style="color: var(--color-text);">No tags yet.</p>
          </div>

          <div
            v-for="tag in tagStore.tags"
            :key="tag.id"
            class="flex items-center gap-3 py-2 border-b-2 last:border-b-0"
            style="border-color: var(--color-border);"
          >
            <!-- View mode -->
            <template v-if="editingId !== tag.id">
              <TagBadge :tag="tag" class="flex-1" />
              <Button variant="neutral" size="sm" @click="startEdit(tag)">Edit</Button>
              <Button variant="neutral" size="sm" @click="confirmDelete(tag)">Delete</Button>
            </template>

            <!-- Edit mode -->
            <template v-else>
              <input
                v-model="editColor"
                type="color"
                class="w-8 h-8 border-2 cursor-pointer shrink-0"
                style="border-color: var(--color-border);"
              />
              <Input v-model="editName" type="text" class="flex-1" />
              <Button size="sm" @click="handleSaveEdit(tag)">Save</Button>
              <Button variant="neutral" size="sm" @click="cancelEdit">Cancel</Button>
            </template>
          </div>

        </CardContent>
      </Card>

      <!-- Create tag -->
      <Card>
        <CardHeader>
          <CardTitle>New Tag</CardTitle>
          <CardDescription>Tags are shared across all boards in this workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleCreate" class="flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <input
                v-model="newColor"
                type="color"
                class="w-10 h-10 border-2 cursor-pointer shrink-0"
                style="border-color: var(--color-border);"
              />
              <Input v-model="newName" type="text" placeholder="Tag name" class="flex-1" required />
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm font-bold text-foreground">Preview:</span>
              <TagBadge :tag="{ id: '', name: newName || 'Tag name', color: newColor, workspaceID: '', createdAt: '' }" />
            </div>
            <p v-if="createError" class="text-sm font-bold" style="color: var(--color-accent);">
              {{ createError }}
            </p>
            <div>
              <Button type="submit">Create tag</Button>
            </div>
          </form>
        </CardContent>
      </Card>

    </div>

    <!-- Delete confirmation -->
    <Dialog v-model:open="deleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete tag?</DialogTitle>
          <DialogDescription>
            Deleting "{{ tagToDelete?.name }}" is permanent and will remove it from all cards in this workspace.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="neutral" @click="deleteDialogOpen = false">Cancel</Button>
          <Button @click="handleDelete">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
