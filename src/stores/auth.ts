import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, register as apiRegister } from '@/lib/api'
import router from '@/router'

import type { User, UserToken } from '@/lib/api'

const STORAGE_KEY_TOKEN = 'kanbam:token'
const STORAGE_KEY_USER = 'kanbam:user'

export const useAuthStore = defineStore('useAuth', () => {
    // state
    const token = ref(localStorage.getItem(STORAGE_KEY_TOKEN))
    const user = ref<User | null>(JSON.parse(localStorage.getItem(STORAGE_KEY_USER) ?? 'null'))

    // getters
    const isAuthenticated = computed(() => token.value !== null)

    // actions
    async function login(email: string, password: string) {
        storeUserToken(await apiLogin(email, password))
        router.push('/workspaces') // temporary route.
    }

    async function register(name: string, email: string, password: string) {
        storeUserToken(await apiRegister({ name, email, password }))
        router.push('/workspaces') // temporary route
    }

    function logout() {
        // Clear memory
        token.value = null
        user.value = null

        // Clear storage
        localStorage.removeItem(STORAGE_KEY_TOKEN)
        localStorage.removeItem(STORAGE_KEY_USER)
        
        router.push('/login')
    }

    // helping functions
    function storeUserToken(userToken: UserToken) {
        token.value = userToken.token
        user.value = userToken.user

        localStorage.setItem(STORAGE_KEY_TOKEN, token.value)
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user.value))
    }

    return { token, user, isAuthenticated, login, register, logout }
})