import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Textarea — multi-line input matching Input style.
 */
const Textarea = forwardRef(
  ({ label, error, hint, className, wrapperClassName, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
        {label && (
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-dark-on-surface-variant ml-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={4}
          className={cn(
            'w-full rounded-sq-md bg-surface-container-lowest dark:bg-dark-surface-container-lowest',
            'border border-outline-variant dark:border-dark-outline-variant',
            'text-primary dark:text-dark-primary placeholder:text-on-surface-variant/50',
            'px-5 py-4 outline-none transition-all duration-200 resize-none',
            'focus:border-secondary/50 input-glow',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-error focus:border-error',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-error ml-1 mt-0.5">{error}</p>}
        {!error && hint && (
          <p className="text-xs text-on-surface-variant ml-1 mt-0.5">{hint}</p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
export default Textarea;
