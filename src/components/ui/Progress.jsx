import { cn, getMatchScoreColor } from '@/lib/utils';

/**
 * ProgressBar — skill bar showing percentage with optional label.
 */
export function ProgressBar({ value = 0, max = 100, label, showValue = false, size = 'md', color = 'secondary', className }) {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeH = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' };
  const colorMap = {
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs font-semibold text-on-surface-variant dark:text-dark-on-surface-variant">{label}</span>}
          {showValue && <span className="text-xs font-bold text-primary dark:text-dark-primary">{Math.round(percent)}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-surface-container-high dark:bg-dark-surface-container-high rounded-full overflow-hidden', sizeH[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', colorMap[color])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

/**
 * MatchScoreBadge — circular percentage display for job/skill matching.
 */
export function MatchScoreBadge({ score = 0, size = 'md', className }) {
  const color = getMatchScoreColor(score);
  const sizes = {
    sm: { outer: 'w-10 h-10', text: 'text-xs' },
    md: { outer: 'w-14 h-14', text: 'text-sm' },
    lg: { outer: 'w-20 h-20', text: 'text-lg' },
  };

  const circumference = 2 * Math.PI * 20;
  const strokeDash = (score / 100) * circumference;

  return (
    <div className={cn('relative flex-shrink-0 flex items-center justify-center', sizes[size].outer, className)}>
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-surface-container-high dark:text-dark-surface-container-high" />
        <circle
          cx="24" cy="24" r="20"
          fill="none" strokeWidth="4"
          strokeLinecap="round"
          className={cn('transition-all duration-700', color.replace('text-', 'stroke-'))}
          strokeDasharray={`${strokeDash} ${circumference}`}
        />
      </svg>
      <span className={cn('relative font-bold font-heading', sizes[size].text, color)}>
        {score}
      </span>
    </div>
  );
}
