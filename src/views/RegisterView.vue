<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// TODO: add refs for name, email, password, and errorMessage
const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')

// Password validation rules (must all be true before submitting)
const hasMinLength = computed(() => password.value.length >= 8 )
const hasUppercase = computed(() => /[A-Z]/.test(password.value))
const hasLowercase = computed(() => /[a-z]/.test(password.value))
const hasDigit = computed(() => /\d/.test(password.value))
const hasSpecial = computed(() => /[@$!%*?&^]/.test(password.value))
const isPasswordValid = computed(() =>
  hasMinLength.value && hasUppercase.value && hasLowercase.value && hasDigit.value && hasSpecial.value
)

async function handleSubmit() {
  if (!isPasswordValid.value) { return }
  try {
    await authStore.register(name.value, email.value, password.value)
  } catch(error) {
    const code = (error as { response?: { data?: { code?: string } } }).response?.data?.code
    if (code == 'EMAIL_TAKEN') {
      errorMessage.value = "This email is already in use, did you mean to login instead?"
    } else {
      errorMessage.value = "An unexpected error occurred"
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
      <p class="text-sm font-bold mb-8" style="color: var(--color-text)">Create an account</p>

      <form @submit.prevent="handleSubmit">

        <!-- Name field -->
        <div class="mb-4">
          <label class="block text-sm font-bold mb-1" style="color: var(--color-text)">
            Name
          </label>
          <input
            v-model="name"
            type="text"
            placeholder="Shrek"
            class="w-full px-3 py-2 border-2 font-mono text-sm outline-none"
            style="border-color: var(--color-border); background-color: var(--color-bg); color: var(--color-text);"
          />
        </div>

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
            style="border-color: var(--color-border); background-color: var(--color-bg); color: var(--color-text);"
          />
        </div>

        <!-- Password field -->
        <div class="mb-4">
          <label class="block text-sm font-bold mb-1" style="color: var(--color-text)">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full px-3 py-2 border-2 font-mono text-sm outline-none"
            style="border-color: var(--color-border); background-color: var(--color-bg); color: var(--color-text);"
          />

          <!-- Password rule indicators — these update live as the user types -->
          <ul class="mt-2 space-y-1">
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

        <!-- Error message -->
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
          REGISTER
        </button>
      </form>

      <!-- Login link -->
      <p class="mt-6 text-sm text-center" style="color: var(--color-text)">
        Already have an account?
        <RouterLink to="/login" class="font-bold underline">Sign in</RouterLink>
      </p>
    </div>
  </div>
</template>
