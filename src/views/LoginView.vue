<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

async function handleSubmit() {
  try {
    await authStore.login(email.value, password.value)
  } catch(error) {
    const code = (error as { response?: { data?: { code?: string } } }).response?.data?.code
    if (code === 'INVALID_CREDENTIALS') {
      errorMessage.value = "Invalid email or password"
    } else {
      errorMessage.value = "An error occurred"
    }
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center" style="background-color: var(--color-bg)">
    <div
      class="w-full max-w-md p-8 border-2"
      style="
        background-color: var(--color-surface);
        border-color: var(--color-border);
        box-shadow: var(--shadow-brutal);
      "
    >
      <!-- Title -->
      <h1 class="text-3xl font-black mb-2" style="color: var(--color-text)">KanBam</h1>
      <p class="text-sm font-bold mb-8" style="color: var(--color-text)">Sign in to your account</p>

      <form @submit.prevent="handleSubmit">

        <!-- Email field -->
        <div class="mb-4">
          <label class="block text-sm font-bold mb-1" style="color: var(--color-text)">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-3 py-2 border-2 font-mono text-sm outline-none"
            style="
              border-color: var(--color-border);
              background-color: var(--color-bg);
              color: var(--color-text);
            "
          />
        </div>

        <!-- Password field -->
        <div class="mb-6">
          <label class="block text-sm font-bold mb-1" style="color: var(--color-text)">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full px-3 py-2 border-2 font-mono text-sm outline-none"
            style="
              border-color: var(--color-border);
              background-color: var(--color-bg);
              color: var(--color-text);
            "
          />
        </div>

        <div
          v-if="errorMessage"
          class="mb-4 px-3 py-2 border-2 text-sm font-bold"
          style="border-color: var(--color-border); background-color: var(--color-accent); color: var(--color-accent-text);"
        >
          {{ errorMessage }}
        </div>

        <!-- Submit button -->
        <button
          type="submit"
          class="w-full py-2 font-black text-sm border-2 cursor-pointer"
          style="
            background-color: var(--color-accent);
            color: var(--color-accent-text);
            border-color: var(--color-border);
            box-shadow: var(--shadow-brutal);
          "
        >
          SIGN IN
        </button>
      </form>

      <!-- Register link -->
      <p class="mt-6 text-sm text-center" style="color: var(--color-text)">
        Don't have an account?
        <RouterLink to="/register" class="font-bold underline">Register</RouterLink>
      </p>
    </div>
  </div>
</template>
