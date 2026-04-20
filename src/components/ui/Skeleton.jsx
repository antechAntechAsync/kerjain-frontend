import { cn } from '@/lib/utils';

/**
 * Skeleton — shimmer placeholders for loading states.
 */
function Skeleton({ className }) {
  return (
    <div
      className={cn(
        'rounded-sq-sm bg-surface-container-high dark:bg-dark-surface-container-high',
        'animate-pulse',
        className,
      )}
    />
  );
}

/** Skeleton.Text — single line or multi-line text */
Skeleton.Text = function SkeletonText({ lines = 1, className }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4 rounded-sq-sm',
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full',
          )}
        />
      ))}
    </div>
  );
};

/** Skeleton.Avatar — circular avatar placeholder */
Skeleton.Avatar = function SkeletonAvatar({ size = 'md', className }) {
  const sizes = { xs: 'w-7 h-7', sm: 'w-9 h-9', md: 'w-11 h-11', lg: 'w-14 h-14' };
  return <Skeleton className={cn('rounded-full', sizes[size], className)} />;
};

/** Skeleton.Card — full card placeholder */
Skeleton.Card = function SkeletonCard({ className }) {
  return (
    <div className={cn('p-6 rounded-sq-lg bg-surface-container-lowest dark:bg-dark-surface-container-high space-y-4', className)}>
      <div className="flex items-center gap-3">
        <Skeleton.Avatar />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2 rounded-sq-sm" />
          <Skeleton className="h-3 w-1/3 rounded-sq-sm" />
        </div>
      </div>
      <Skeleton.Text lines={3} />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
};

export default Skeleton;
