import { useLangStore } from '@/stores/langStore';
import { cn } from '@/lib/utils';

/**
 * LangToggle — bilingual EN/ID language switcher.
 * Shows current language flag emoji + code.
 */
export default function LangToggle({ className }) {
  const { lang, toggleLang } = useLangStore();

  return (
    <button
      onClick={toggleLang}
      aria-label={`Switch language to ${lang === 'en' ? 'Bahasa Indonesia' : 'English'}`}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
        'bg-surface-container-low dark:bg-dark-surface-container hover:bg-surface-container-high dark:hover:bg-dark-surface-container-high',
        'text-xs font-bold text-primary dark:text-dark-primary',
        'transition-all duration-200 spring',
        className,
      )}
    >
      <span className="text-base leading-none">{lang === 'en' ? '🇺🇸' : '🇮🇩'}</span>
      <span className="uppercase tracking-widest">{lang === 'en' ? 'EN' : 'ID'}</span>
    </button>
  );
}
