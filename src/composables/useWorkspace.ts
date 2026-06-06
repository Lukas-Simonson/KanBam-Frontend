import { useWorkspaceStore } from '@/stores/workspace';

export function useWorkspace() {
    const store = useWorkspaceStore()

    return {
        workspaces: store.workspaces,
        activeWorkspace: store.activeWorkspace,
        members: store.members,
        fetchWorkspaces: store.fetchWorkspaces,
        fetchWorkspace: store.fetchWorkspace,
        createWorkspace: store.createWorkspace,
        updateWorkspace: store.updateWorkspace,
        deleteWorkspace: store.deleteWorkspace,
        fetchMembers: store.fetchMembers,
        addMember: store.addMember,
        updateMemberRole: store.updateMemberRole,
        removeMember: store.removeMember
    }
}