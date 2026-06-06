<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/card'
import { Input } from '@/components/input'
import { Button } from '@/components/button'

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

async function handleSubmit() {
  try {
    await authStore.login(email.value, password.value)
  } catch (error) {
    const code = (error as { response?: { data?: { code?: string } } }).response?.data?.code
    if (code === 'INVALID_CREDENTIALS') {
      errorMessage.value = 'Invalid email or password'
    } else {
      errorMessage.value = 'An error occurred'
    }
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center" style="background-color: var(--color-bg)">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-3xl font-black">KanBam</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-bold text-foreground">Email</label>
            <Input v-model="email" type="email" placeholder="you@example.com" />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-bold text-foreground">Password</label>
            <Input v-model="password" type="password" placeholder="••••••••" />
          </div>

          <div
            v-if="errorMessage"
            class="px-3 py-2 border-2 text-sm font-bold"
            style="border-color: var(--color-border); background-color: var(--color-accent); color: var(--color-accent-text);"
          >
            {{ errorMessage }}
          </div>

          <Button type="submit" class="w-full mt-2">SIGN IN</Button>
        </form>
      </CardContent>

      <CardFooter class="justify-center">
        <p class="text-sm text-foreground">
          Don't have an account?
          <RouterLink to="/register" class="font-bold underline">Register</RouterLink>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>
