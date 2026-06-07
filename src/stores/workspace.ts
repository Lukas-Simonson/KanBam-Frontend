import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  getWorkspaces,
  getWorkspace,
  createWorkspace as apiCreateWorkspace,
  updateWorkspace as apiUpdateWorkspace,
  deleteWorkspace as apiDeleteWorkspace,
  getMembers,
  addMember as apiAddMember,
  updateMember as apiUpdateMember,
  removeMember as apiRemoveMember,
} from '@/lib/api'
import type { Workspace, WorkspaceCreation, WorkspaceUpdate, Membership, MembershipUpdate, UserRole } from '@/lib/api'

export const useWorkspaceStore = defineStore('workspace', () => {
  // state
  const workspaces = ref<Workspace[]>([])
  const activeWorkspace = ref<Workspace | null>(null)
  const members = ref<UserRole[]>([])

  // getters
  const currentUserRole = computed(() => {
    const auth = useAuthStore()
    return members.value.find(m => m.id === auth.user?.id)?.role ?? null
  })

  const isOwner = computed(() => currentUserRole.value === 'owner')
  const isAdmin = computed(() => currentUserRole.value === 'admin')
  const canManageWorkspace = computed(() => isOwner.value || isAdmin.value)

  // Returns true if the current user can edit the given member's role
  // Rules:
  // - Owner role is always read-only (can't be changed by anyone)
  // - Users cannot change their own role
  // - Owners can manage admins, contributors, and viewers
  // - Admins can only manage contributors and viewers
  function canManageMember(member: UserRole): boolean {
    const auth = useAuthStore()
    if (member.role === 'owner') return false
    if (member.id === auth.user?.id) return false
    if (isOwner.value) return true
    if (isAdmin.value) return member.role === 'contributer' || member.role === 'viewer'
    return false
  }

  // actions
  async function fetchWorkspaces() {
    workspaces.value = await getWorkspaces()
  }

  async function fetchWorkspace(id: string) {
    activeWorkspace.value = await getWorkspace(id)
  }

  async function createWorkspace(body: WorkspaceCreation) {
    const workspace = await apiCreateWorkspace(body)
    workspaces.value.push(workspace)
    return workspace
  }

  async function updateWorkspace(id: string, body: WorkspaceUpdate) {
    const updated = await apiUpdateWorkspace(id, body)
    const index = workspaces.value.findIndex(w => w.id === id)
    if (index >= 0) workspaces.value[index] = updated
    if (activeWorkspace.value?.id === id) activeWorkspace.value = updated
    return updated
  }

  async function deleteWorkspace(id: string) {
    await apiDeleteWorkspace(id)
    workspaces.value = workspaces.value.filter(w => w.id !== id)
    if (activeWorkspace.value?.id === id) activeWorkspace.value = null
  }

  async function fetchMembers(workspaceId: string) {
    members.value = await getMembers(workspaceId)
  }

  async function addMember(workspaceId: string, body: Membership) {
    await apiAddMember(workspaceId, body)
    await fetchMembers(workspaceId)
  }

  async function updateMemberRole(workspaceId: string, userId: string, body: MembershipUpdate) {
    await apiUpdateMember(workspaceId, userId, body)
    await fetchMembers(workspaceId)
  }

  async function removeMember(workspaceId: string, userId: string) {
    await apiRemoveMember(workspaceId, userId)
    await fetchMembers(workspaceId)
  }

  return {
    workspaces,
    activeWorkspace,
    members,
    currentUserRole,
    isOwner,
    isAdmin,
    canManageWorkspace,
    canManageMember,
    fetchWorkspaces,
    fetchWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    fetchMembers,
    addMember,
    updateMemberRole,
    removeMember,
  }
})
