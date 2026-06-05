import { useThemeStore } from '@/stores/theme';
import type { CustomTheme } from '@/stores/theme';

export function useTheme() {
    const store = useThemeStore();

    return {
        allThemeIds: store.allThemeIds,
        activeThemeId: store.activeThemeId,
        setTheme: store.setTheme,
        saveCustomTheme: store.saveCustomTheme,
        deleteCustomTheme: store.deleteCustomTheme,
    }
}

export type { CustomTheme }