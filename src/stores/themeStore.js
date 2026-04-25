import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Theme Store (Zustand)
 *
 * Manages light/dark mode toggle.
 * Applies the `dark` class on the <html> element for Tailwind v4.
 */
export const useThemeStore = create(
  persist(
    (set, get) => ({
      mode: 'light', // 'light' | 'dark' | 'system'

      setMode: (mode) => {
        set({ mode });
        applyTheme(mode);
      },

      toggleMode: () => {
        const next = get().mode === 'dark' ? 'light' : 'dark';
        set({ mode: next });
        applyTheme(next);
      },

      isDark: () => get().mode === 'dark',
    }),
    {
      name: 'kerjain-theme',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Apply theme on hydration (page load)
        if (state) {
          applyTheme(state.mode);
        }
      },
    },
  ),
);

/**
 * Apply theme to DOM.
 */
function applyTheme(mode) {
  const root = document.documentElement;

  if (mode === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  } else {
    root.classList.toggle('dark', mode === 'dark');
  }
}
