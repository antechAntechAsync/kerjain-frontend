import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Button component — Editorial Futurity design system.
 *
 * Variants:
 *  - primary:   Pill shape, secondary color, Vocational Spring hover
 *  - secondary: Glassmorphic background with ghost border
 *  - tertiary:  Text-only with expanding underline
 *  - danger:    Red variant for destructive actions
 *  - ghost:     Transparent with hover fill
 *
 * Sizes: sm | md | lg
 */
const variantStyles = {
  primary: [
    'bg-secondary text-white font-bold rounded-full',
    'shadow-lg shadow-secondary/20',
    'hover:bg-secondary-hover hover:shadow-secondary/30',
    'active:scale-[0.97]',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
  ],
  secondary: [
    'glass ghost-border text-primary dark:text-dark-primary font-semibold rounded-full',
    'hover:bg-surface-container-lowest dark:hover:bg-dark-surface-container-high',
  ],
  tertiary: [
    'text-secondary dark:text-dark-secondary font-semibold',
    'underline underline-offset-4 decoration-secondary/30',
    'hover:decoration-secondary transition-all',
  ],
  danger: [
    'bg-error text-white font-bold rounded-full',
    'shadow-lg shadow-error/20',
    'hover:opacity-90',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  ghost: [
    'text-on-surface-variant dark:text-dark-on-surface-variant font-semibold rounded-full',
    'hover:bg-surface-container-low dark:hover:bg-dark-surface-container-high',
  ],
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-sm gap-2',
  lg: 'px-8 py-4 text-base gap-2.5',
};

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center',
          'transition-all duration-200 spring font-heading',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
