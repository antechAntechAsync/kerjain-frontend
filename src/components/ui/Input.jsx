import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Input — squircle input with ghost border and input-glow focus.
 */
export const Input = forwardRef(
  ({ label, error, hint, leftIcon, rightIcon, className, wrapperClassName, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
        {label && (
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-dark-on-surface-variant ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-dark-on-surface-variant">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-sq-md bg-surface-container-lowest dark:bg-dark-surface-container-lowest',
              'border border-outline-variant dark:border-dark-outline-variant',
              'text-primary dark:text-dark-primary placeholder:text-on-surface-variant/50',
              'px-5 py-4 outline-none transition-all duration-200',
              'focus:border-secondary/50 input-glow',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon && 'pl-11',
              rightIcon && 'pr-11',
              error && 'border-error focus:border-error',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-dark-on-surface-variant">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-error ml-1 mt-0.5">{error}</p>}
        {!error && hint && <p className="text-xs text-on-surface-variant ml-1 mt-0.5">{hint}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';

export default Input;
