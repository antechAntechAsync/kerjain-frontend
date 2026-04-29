import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Language Store (Zustand)
 *
 * Manages bilingual toggle (EN/ID).
 * Syncs with i18next when the language changes.
 */
export const useLangStore = create(
  persist(
    (set) => ({
      lang: 'id', // 'en' | 'id'

      setLang: (lang) => {
        set({ lang });
        // i18next language change is handled in the i18n config listener
      },

      toggleLang: () => {
        set((state) => {
          const next = state.lang === 'en' ? 'id' : 'en';
          return { lang: next };
        });
      },
    }),
    {
      name: 'kerjain-lang',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
