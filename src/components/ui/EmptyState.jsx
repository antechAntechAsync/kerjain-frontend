import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

/**
 * EmptyState — illustrated placeholder for empty lists.
 */
export default function EmptyState({ icon: Icon = Search, title, description, action, className }) {
  const { t } = useTranslation();

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-8 text-center', className)}>
      <div className="w-16 h-16 rounded-sq-lg bg-surface-container-low dark:bg-dark-surface-container flex items-center justify-center mb-5">
        <Icon size={28} className="text-on-surface-variant dark:text-dark-on-surface-variant" />
      </div>
      <h3 className="font-heading text-lg font-bold text-primary dark:text-dark-primary tracking-tight mb-2">
        {title ?? t('common.noData')}
      </h3>
      {description && (
        <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant max-w-sm leading-relaxed mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
