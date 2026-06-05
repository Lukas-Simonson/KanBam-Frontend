import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CustomTheme {
  id: string
  name: string
  properties: {
    '--color-bg': string
    '--color-surface': string
    '--color-border': string
    '--color-text': string
    '--color-accent': string
    '--color-accent-text': string
    '--shadow-brutal': string
  }
}

const PREDEFINED_THEMES = ['brutal-light', 'brutal-dark', 'brutal-red', 'brutal-blue'] as const

const STORAGE_KEY_ACTIVE = 'kanbam:active-theme'
const STORAGE_KEY_CUSTOM = 'kanbam:themes'

export const useThemeStore = defineStore('theme', () => {
  // state
  const activeThemeId = ref(localStorage.getItem(STORAGE_KEY_ACTIVE) ?? 'brutal-light')
  const customThemes = ref<CustomTheme[]>(JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM) ?? "[]") ?? [])

  // getters
  const allThemeIds = computed(() => [...customThemes.value.map((theme) => theme.id), ...PREDEFINED_THEMES])

  // actions
  function setTheme(id: string) {
    activeThemeId.value = id;
    document.documentElement.setAttribute('data-theme', id);
    localStorage.setItem(STORAGE_KEY_ACTIVE, id);
  }

  function saveCustomTheme(theme: CustomTheme) {
    const existing = customThemes.value.findIndex(t => t.id === theme.id)
    if (existing >= 0) {
        customThemes.value[existing] = theme
    } else {
        customThemes.value.push(theme)
    }
    localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(customThemes.value))
  }

  function deleteCustomTheme(id: string) {
    customThemes.value = customThemes.value.filter((theme) => theme.id != id)
    localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(customThemes.value));
  }

  document.documentElement.setAttribute('data-theme', activeThemeId.value)

  return { activeThemeId, customThemes, allThemeIds, setTheme, saveCustomTheme, deleteCustomTheme }
})