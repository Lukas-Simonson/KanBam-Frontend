<script setup lang="ts">
import { ref, onMounted, computed, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ColumnDef, SortingState } from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { useWorkspaceStore } from '@/stores/workspace'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/table'
import MemberActionsCell from '@/components/workspace/MemberActionsCell.vue'
import { valueUpdater } from '@/lib/utils'
import type { Role, UserRole } from '@/lib/api'

const route = useRoute()
const router = useRouter()
const workspaceStore = useWorkspaceStore()
const workspaceId = route.params.workspaceId as string

const editTitle = ref('')
const editDescription = ref('')
const newMemberUserId = ref('')
const newMemberRole = ref<Role>('viewer')
const addMemberError = ref('')
const deleteDialogOpen = ref(false)
const sorting = ref<SortingState>([])

onMounted(async () => {
  await Promise.all([
    workspaceStore.fetchWorkspace(workspaceId),
    workspaceStore.fetchMembers(workspaceId),
  ])
  editTitle.value = workspaceStore.activeWorkspace?.title ?? ''
  editDescription.value = workspaceStore.activeWorkspace?.description ?? ''
})

async function handleSaveSettings() {
  await workspaceStore.updateWorkspace(workspaceId, {
    title: editTitle.value,
    description: editDescription.value,
  })
}

async function handleAddMember() {
  try {
    await workspaceStore.addMember(workspaceId, {
      userID: newMemberUserId.value,
      role: newMemberRole.value,
    })
    newMemberUserId.value = ''
    newMemberRole.value = 'viewer'
    addMemberError.value = ''
  } catch {
    addMemberError.value = 'Could not add member. Check the user ID and try again.'
  }
}

async function handleUpdateRole(userId: string, role: Role) {
  await workspaceStore.updateMemberRole(workspaceId, userId, { role })
}

async function handleRemoveMember(userId: string) {
  await workspaceStore.removeMember(workspaceId, userId)
}

async function handleDelete() {
  await workspaceStore.deleteWorkspace(workspaceId)
  router.push('/workspaces')
}

const columns: ColumnDef<UserRole>[] = [
  {
    accessorKey: 'name',
    header: 'Member',
    cell: ({ row }) => {
      const member = row.original
      return h('div', { class: 'flex items-center gap-3' }, [
        h('span', {
          class: 'flex items-center justify-center w-8 h-8 border-2 text-xs font-black shrink-0',
          style: 'border-color: var(--color-border); background-color: var(--color-accent); color: var(--color-accent-text);',
        }, member.name.charAt(0).toUpperCase()),
        h('div', {}, [
          h('p', { class: 'text-sm font-bold', style: 'color: var(--color-text);' }, member.name),
          h('p', { class: 'text-xs opacity-50', style: 'color: var(--color-text);' }, member.email),
        ]),
      ])
    },
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-right' }, 'Role & Actions'),
    cell: ({ row }) => {
      const member = row.original
      return h(MemberActionsCell, {
        member,
        canManage: workspaceStore.canManageMember(member),
        onUpdateRole: (role: Role) => handleUpdateRole(member.id, role),
        onRemove: () => handleRemoveMember(member.id),
      })
    },
  },
]

const table = useVueTable({
  get data() { return workspaceStore.members },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  state: {
    get sorting() { return sorting.value },
  },
})
</script>

<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-black" style="color: var(--color-text);">Settings</h1>
      <p class="text-sm font-bold mt-1" style="color: var(--color-text); opacity: 0.6;">
        {{ workspaceStore.activeWorkspace?.title }}
      </p>
    </div>

    <div class="flex flex-col gap-8 max-w-2xl">

      <!-- Edit workspace -->
      <Card>
        <CardHeader>
          <CardTitle>Workspace Settings</CardTitle>
          <CardDescription>Update the name and description of this workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSaveSettings" class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-bold text-foreground">Title</label>
              <Input v-model="editTitle" type="text" placeholder="Workspace title" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-bold text-foreground">Description (optional)</label>
              <Input v-model="editDescription" type="text" placeholder="What is this workspace for?" />
            </div>
            <div>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <!-- Members table -->
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>Manage who has access to this workspace.</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <Table>
            <TableHeader>
              <TableRow
                v-for="headerGroup in table.getHeaderGroups()"
                :key="headerGroup.id"
              >
                <TableHead
                  v-for="header in headerGroup.headers"
                  :key="header.id"
                >
                  <FlexRender
                    v-if="!header.isPlaceholder"
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="row in table.getRowModel().rows"
                :key="row.id"
              >
                <TableCell
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id"
                  class="px-4 py-2"
                >
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </TableCell>
              </TableRow>
              <TableRow v-if="table.getRowModel().rows.length === 0">
                <TableCell :colspan="columns.length" class="h-24 text-center">
                  No members found.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <!-- Add member form -->
          <form v-if="workspaceStore.canManageWorkspace" class="flex gap-2 pt-2" @submit.prevent="handleAddMember">
            <Input v-model="newMemberUserId" type="text" placeholder="User ID" class="flex-1" />
            <Select v-model="newMemberRole">
              <SelectTrigger class="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="contributer">Contributor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Add</Button>
          </form>
          <p v-if="addMemberError" class="text-sm font-bold" style="color: var(--color-accent);">
            {{ addMemberError }}
          </p>
        </CardContent>
      </Card>

      <!-- Danger zone — owner only -->
      <Card v-if="workspaceStore.isOwner">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>Permanently delete this workspace and all its boards and cards.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="neutral" @click="deleteDialogOpen = true">Delete workspace</Button>
        </CardFooter>
      </Card>

    </div>

    <!-- Delete confirmation dialog -->
    <Dialog v-model:open="deleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete workspace?</DialogTitle>
          <DialogDescription>
            This will permanently delete "{{ workspaceStore.activeWorkspace?.title }}" and all its boards and cards. This cannot be undone.
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
