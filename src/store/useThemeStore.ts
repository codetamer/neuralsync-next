import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'zenith' | 'original';

interface ThemeState {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'zenith',
            toggleTheme: () => set((state) => ({
                theme: state.theme === 'zenith' ? 'original' : 'zenith'
            })),
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: 'neuralsync-theme-storage',
        }
    )
);
