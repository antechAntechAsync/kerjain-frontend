import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { cn } from '@/lib/utils';

/**
 * ThemeToggle — light/dark mode switch button.
 * Syncs with Zustand themeStore and applies `.dark` class to <html>.
 */
export default function ThemeToggle({ className }) {
  const { mode, toggleMode } = useThemeStore();
  const isDark = mode === 'dark';

  return (
    <button
      onClick={toggleMode}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'relative w-12 h-7 rounded-full transition-colors duration-300',
        isDark ? 'bg-secondary' : 'bg-surface-container-high dark:bg-dark-surface-container',
        'flex items-center px-1 cursor-pointer spring',
        className,
      )}
    >
      <span
        className={cn(
          'absolute w-5 h-5 rounded-full flex items-center justify-center',
          'bg-surface-container-lowest dark:bg-dark-surface-container-lowest shadow-sm',
          'transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]',
          isDark ? 'translate-x-5' : 'translate-x-0',
        )}
      >
        {isDark ? (
          <Moon size={11} className="text-secondary" />
        ) : (
          <Sun size={11} className="text-warning" />
        )}
      </span>
    </button>
  );
}
