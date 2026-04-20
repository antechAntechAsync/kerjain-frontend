import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en.json';
import id from '@/locales/id.json';
import { useLangStore } from '@/stores/langStore';

/**
 * i18n configuration — bilingual EN/ID.
 * Language is synced with Zustand langStore.
 */
i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    id: { translation: id },
  },
  lng: useLangStore.getState().lang,
  fallbackLng: 'id',
  interpolation: {
    escapeValue: false, // React handles XSS
  },
});

// Sync Zustand ↔ i18next
useLangStore.subscribe((state) => {
  if (i18next.language !== state.lang) {
    i18next.changeLanguage(state.lang);
  }
});

export default i18next;
