import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Select — native select with squircle styling + chevron icon.
 */
const Select = forwardRef(
  ({ label, error, hint, className, wrapperClassName, children, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
        {label && (
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-dark-on-surface-variant ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full rounded-sq-md bg-surface-container-lowest dark:bg-dark-surface-container-lowest',
              'border border-outline-variant dark:border-dark-outline-variant',
              'text-primary dark:text-dark-primary',
              'px-5 py-4 pr-12 outline-none transition-all duration-200',
              'focus:border-secondary/50 input-glow',
              'appearance-none cursor-pointer',
              error && 'border-error',
              className,
            )}
            {...props}
          >
            {children}
          </select>
          {/* Chevron icon */}
          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </span>
        </div>
        {error && <p className="text-xs text-error ml-1 mt-0.5">{error}</p>}
        {!error && hint && (
          <p className="text-xs text-on-surface-variant ml-1 mt-0.5">{hint}</p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
export default Select;
