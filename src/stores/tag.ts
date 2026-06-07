import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getTags,
  createTag as apiCreateTag,
  updateTag as apiUpdateTag,
  deleteTag as apiDeleteTag,
} from '@/lib/api'
import type { Tag, TagCreation, TagUpdate } from '@/lib/api'

export const useTagStore = defineStore('tag', () => {
  // state
  const tags = ref<Tag[]>([])

  // actions
  async function fetchTags(workspaceId: string) {
    tags.value = await getTags(workspaceId)
  }

  async function createTag(workspaceId: string, body: TagCreation) {
    const tag = await apiCreateTag(workspaceId, body)
    tags.value.push(tag)
    return tag
  }

  async function updateTag(id: string, body: TagUpdate) {
    const updated = await apiUpdateTag(id, body)
    const index = tags.value.findIndex(t => t.id === id)
    if (index >= 0) tags.value[index] = updated
    return updated
  }

  async function deleteTag(id: string) {
    await apiDeleteTag(id)
    tags.value = tags.value.filter(t => t.id !== id)
  }

  return { tags, fetchTags, createTag, updateTag, deleteTag }
})
