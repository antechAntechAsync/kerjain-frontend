import { getInitials, cn } from '@/lib/utils';

/**
 * Avatar — user photo with initials fallback.
 * Sizes: xs | sm | md | lg | xl
 */
const sizeStyles = {
  xs: 'w-7 h-7 text-[10px]',
  sm: 'w-9 h-9 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
};

const ringColors = {
  surface: 'ring-surface dark:ring-dark-surface',
  white: 'ring-white',
  primary: 'ring-primary-container',
};

export default function Avatar({
  src,
  name,
  size = 'md',
  ring = null,
  ringSize = 2,
  className,
}) {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        'relative flex-shrink-0 rounded-full overflow-hidden',
        'bg-primary-fixed-dim text-on-primary-fixed-variant',
        sizeStyles[size],
        ring && `ring-${ringSize} ${ringColors[ring] ?? ringColors.surface}`,
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name ?? 'Avatar'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center font-bold font-heading">
          {initials}
        </div>
      )}
    </div>
  );
}
