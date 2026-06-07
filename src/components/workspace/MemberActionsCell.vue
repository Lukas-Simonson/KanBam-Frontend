<script setup lang="ts">
import type { UserRole, Role } from '@/lib/api'
import { Button } from '@/components/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/select'

const props = defineProps<{
  member: UserRole
  canManage: boolean
}>()

const emit = defineEmits<{
  updateRole: [role: Role]
  remove: []
}>()
</script>

<template>
  <div class="flex items-center gap-2 justify-end">
    <template v-if="canManage">
      <Select
        :model-value="member.role"
        @update:model-value="(role) => emit('updateRole', role as Role)"
      >
        <SelectTrigger class="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="contributer">Contributor</SelectItem>
          <SelectItem value="viewer">Viewer</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="neutral" size="sm" @click="emit('remove')">Remove</Button>
    </template>
    <span v-else class="text-sm font-bold capitalize px-2">{{ member.role }}</span>
  </div>
</template>
