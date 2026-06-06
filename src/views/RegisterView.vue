<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/card'
import { Input } from '@/components/input'
import { Button } from '@/components/button'

const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const hasMinLength = computed(() => password.value.length >= 8)
const hasUppercase = computed(() => /[A-Z]/.test(password.value))
const hasLowercase = computed(() => /[a-z]/.test(password.value))
const hasDigit = computed(() => /\d/.test(password.value))
const hasSpecial = computed(() => /[@$!%*?&^]/.test(password.value))
const isPasswordValid = computed(() =>
  hasMinLength.value && hasUppercase.value && hasLowercase.value && hasDigit.value && hasSpecial.value
)

async function handleSubmit() {
  if (!isPasswordValid.value) return
  try {
    await authStore.register(name.value, email.value, password.value)
  } catch (error) {
    const code = (error as { response?: { data?: { code?: string } } }).response?.data?.code
    if (code === 'EMAIL_TAKEN') {
      errorMessage.value = 'This email is already in use, did you mean to login instead?'
    } else {
      errorMessage.value = 'An unexpected error occurred'
    }
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center" style="background-color: var(--color-bg)">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-3xl font-black">KanBam</CardTitle>
        <CardDescription>Create an account</CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-bold text-foreground">Name</label>
            <Input v-model="name" type="text" placeholder="Shrek" />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-bold text-foreground">Email</label>
            <Input v-model="email" type="email" placeholder="you@example.com" />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-bold text-foreground">Password</label>
            <Input v-model="password" type="password" placeholder="••••••••" />
            <ul class="mt-1 space-y-1">
              <li
                v-for="rule in [
                  { label: 'At least 8 characters', valid: hasMinLength },
                  { label: 'Uppercase letter', valid: hasUppercase },
                  { label: 'Lowercase letter', valid: hasLowercase },
                  { label: 'Number', valid: hasDigit },
                  { label: 'Special character (@$!%*?&^)', valid: hasSpecial },
                ]"
                :key="rule.label"
                class="text-xs font-bold"
                :style="{ color: rule.valid ? 'green' : 'var(--color-text)', opacity: rule.valid ? 1 : 0.5 }"
              >
                {{ rule.valid ? '✓' : '○' }} {{ rule.label }}
              </li>
            </ul>
          </div>

          <div
            v-if="errorMessage"
            class="px-3 py-2 border-2 text-sm font-bold"
            style="border-color: var(--color-border); background-color: var(--color-accent); color: var(--color-accent-text);"
          >
            {{ errorMessage }}
          </div>

          <Button type="submit" class="w-full mt-2">REGISTER</Button>
        </form>
      </CardContent>

      <CardFooter class="justify-center">
        <p class="text-sm text-foreground">
          Already have an account?
          <RouterLink to="/login" class="font-bold underline">Sign in</RouterLink>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>
