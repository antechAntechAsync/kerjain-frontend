import { cn } from '@/lib/utils';

/**
 * Badge — status pill with semantic colors.
 *
 * Variants: default | success | warning | error | info | outline
 */
const variantStyles = {
  default: 'bg-surface-container-high text-on-surface-variant dark:bg-dark-surface-container-high dark:text-dark-on-surface-variant',
  success: 'bg-success-container text-success dark:bg-success/20 dark:text-green-400',
  warning: 'bg-warning-container text-warning dark:bg-yellow-500/20 dark:text-yellow-400',
  error: 'bg-error-container text-error dark:bg-red-500/20 dark:text-red-400',
  info: 'bg-primary-fixed text-secondary dark:bg-secondary/20 dark:text-dark-secondary',
  primary: 'bg-secondary text-white',
  outline: 'border border-outline-variant text-on-surface-variant dark:border-dark-outline-variant dark:text-dark-on-surface-variant',
};

export default function Badge({ children, variant = 'default', className, dot = false }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full',
        'text-[10px] font-black uppercase tracking-widest',
        variantStyles[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            variant === 'success' && 'bg-success animate-pulse',
            variant === 'warning' && 'bg-warning',
            variant === 'error' && 'bg-error',
            variant === 'info' && 'bg-secondary',
            variant === 'primary' && 'bg-white',
          )}
        />
      )}
      {children}
    </span>
  );
}
