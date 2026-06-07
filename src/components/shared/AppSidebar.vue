<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useWorkspaceStore } from '@/stores/workspace'
import { useBoardStore } from '@/stores/board'
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from '@/components/sidebar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/dropdown-menu'

const route = useRoute()
const authStore = useAuthStore()
const workspaceStore = useWorkspaceStore()
const boardStore = useBoardStore()

const activeWorkspaceId = computed(() => route.params.workspaceId as string | undefined)
const activeWorkspace = computed(() =>
  workspaceStore.workspaces.find(w => w.id === activeWorkspaceId.value)
)
</script>

<template>
  <Sidebar collapsible="offcanvas">

    <!-- Workspace picker in header -->
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SidebarMenuButton size="lg" class="cursor-pointer">
                <div
                  class="flex aspect-square size-8 items-center justify-center border-2 text-sm font-black shrink-0"
                  style="border-color: var(--color-border); background-color: var(--color-accent); color: var(--color-accent-text);"
                >
                  {{ (activeWorkspace?.title ?? 'W').charAt(0).toUpperCase() }}
                </div>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-bold" style="color: var(--color-text);">
                    {{ activeWorkspace?.title ?? 'Select workspace' }}
                  </span>
                  <span class="truncate text-xs opacity-50" style="color: var(--color-text);">Workspace</span>
                </div>
                <span class="text-xs opacity-40">▼</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent class="w-56" align="start">
              <DropdownMenuLabel>Switch workspace</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                v-for="workspace in workspaceStore.workspaces"
                :key="workspace.id"
                as-child
              >
                <RouterLink :to="`/workspaces/${workspace.id}`" class="no-underline w-full flex items-center gap-2">
                  <span
                    class="flex items-center justify-center w-5 h-5 border-2 text-xs font-black shrink-0"
                    style="border-color: var(--color-border);"
                  >
                    {{ workspace.title.charAt(0).toUpperCase() }}
                  </span>
                  <span class="truncate">{{ workspace.title }}</span>
                </RouterLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem as-child>
                <RouterLink to="/workspaces" class="no-underline w-full">
                  ← All workspaces
                </RouterLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <!-- Nav content -->
    <SidebarContent>

      <!-- Workspace-specific nav — only shown when inside a workspace -->
      <SidebarGroup v-if="activeWorkspaceId">
        <SidebarGroupLabel>Workspace</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton as-child>
                <RouterLink :to="`/workspaces/${activeWorkspaceId}`" class="no-underline">
                  <span>Boards</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton as-child>
                <RouterLink :to="`/workspaces/${activeWorkspaceId}/settings`" class="no-underline">
                  <span>Settings</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <!-- Board list — shown when inside a workspace and boards exist -->
      <SidebarGroup v-if="activeWorkspaceId && boardStore.boards.length > 0">
        <SidebarGroupLabel>Boards</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem
              v-for="board in boardStore.boards.filter(b => !b.isArchived)"
              :key="board.id"
            >
              <SidebarMenuButton as-child>
                <RouterLink :to="`/workspaces/${activeWorkspaceId}/boards/${board.id}`" class="no-underline">
                  <span
                    class="inline-flex items-center justify-center w-5 h-5 border text-xs font-black shrink-0"
                    style="border-color: var(--color-border);"
                  >
                    {{ board.prefix.charAt(0) }}
                  </span>
                  <span>{{ board.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>General</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton as-child>
                <RouterLink to="/workspaces" class="no-underline">
                  <span>All Workspaces</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

    </SidebarContent>

    <!-- User footer -->
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div
              class="flex aspect-square size-8 items-center justify-center border-2 text-sm font-black shrink-0"
              style="border-color: var(--color-border); background-color: var(--color-accent); color: var(--color-accent-text);"
            >
              {{ authStore.user?.name?.charAt(0).toUpperCase() }}
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-bold" style="color: var(--color-text);">{{ authStore.user?.name }}</span>
              <span class="truncate text-xs opacity-50" style="color: var(--color-text);">{{ authStore.user?.email }}</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton as-child>
            <button class="w-full text-left" @click="authStore.logout()">
              <span>Sign out</span>
            </button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
