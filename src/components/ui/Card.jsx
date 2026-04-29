import { cn } from '@/lib/utils';

/**
 * Card — bento-style container with squircle radius.
 *
 * Variants:
 *  - default:   surface-container-lowest (white)
 *  - muted:     surface-container-low (soft grey)
 *  - dark:      primary-container (dark navy) — for "visual anchor" sections
 *  - glass:     glassmorphic with backdrop blur
 */
const variantStyles = {
  default: [
    'bg-surface-container-lowest dark:bg-dark-surface-container-high',
    'shadow-card',
  ],
  muted: [
    'bg-surface-container-low dark:bg-dark-surface-container-low',
  ],
  dark: [
    'bg-primary-container text-on-primary',
  ],
  glass: [
    'glass ghost-border',
    'shadow-glass',
  ],
};

function Card({ children, variant = 'default', className, padding = true, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-sq-lg overflow-hidden',
        'transition-all duration-200',
        variantStyles[variant],
        padding && 'p-6',
        onClick && 'cursor-pointer hover:shadow-ambient spring',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Card.Header — optional titled section header */
Card.Header = function CardHeader({ children, className }) {
  return (
    <div className={cn('mb-5 flex items-center justify-between', className)}>
      {children}
    </div>
  );
};

/** Card.Title — styled heading inside card */
Card.Title = function CardTitle({ children, className }) {
  return (
    <h3 className={cn('font-heading text-lg font-bold text-primary dark:text-dark-primary tracking-tight', className)}>
      {children}
    </h3>
  );
};

/** Card.Subtitle — secondary label in card header */
Card.Subtitle = function CardSubtitle({ children, className }) {
  return (
    <p className={cn('text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-dark-on-surface-variant', className)}>
      {children}
    </p>
  );
};

export default Card;
