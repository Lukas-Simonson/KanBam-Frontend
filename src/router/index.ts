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
      path: '/workspaces',
      component: () => import('@/views/WorkspaceListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/workspaces/:workspaceId',
      component: () => import('@/views/WorkspaceView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/workspaces/:workspaceId/boards/:boardId',
      component: () => import('@/views/BoardView.vue'),
      meta: { requiresAuth: true }
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return '/login'
  if (to.meta.guestOnly && auth.isAuthenticated) return '/workspaces'
})

export default router
