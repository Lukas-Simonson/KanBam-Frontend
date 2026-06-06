<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

// Initializing the store here causes it to run its setup code on app start,
// which reads the saved theme from localStorage and applies it to the DOM.
useThemeStore()
</script>

<template>
  <RouterView />
</template>
