import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean,
    guestOnly?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/workspaces'
    },
    {
      path: '/login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/',
      component: () => import('@/views/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'workspaces',
          component: () => import('@/views/WorkspaceListView.vue'),
        },
        {
          path: 'workspaces/:workspaceId',
          component: () => import('@/views/WorkspaceView.vue'),
        },
        {
          path: 'workspaces/:workspaceId/settings',
          component: () => import('@/views/WorkspaceSettingsView.vue'),
        },
        {
          path: 'workspaces/:workspaceId/boards/:boardId',
          component: () => import('@/views/BoardView.vue'),
        },
      ]
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return '/login'
  if (to.meta.guestOnly && auth.isAuthenticated) return '/workspaces'
})

export default router
