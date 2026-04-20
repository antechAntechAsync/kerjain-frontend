import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Pagination — matches TanStack Query pagination meta from backend.
 *
 * Props:
 *   meta: { current_page, per_page, total, last_page }
 *   onChange: (page: number) => void
 */
export default function Pagination({ meta, onChange, className }) {
  const { t } = useTranslation();
  if (!meta || meta.last_page <= 1) return null;

  const { current_page, last_page, total } = meta;

  const pages = buildPageNumbers(current_page, last_page);

  return (
    <div className={cn('flex items-center justify-between gap-4 flex-wrap', className)}>
      <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant">
        {t('common.page')} <span className="font-bold text-primary dark:text-dark-primary">{current_page}</span>{' '}
        {t('common.of')} <span className="font-bold text-primary dark:text-dark-primary">{last_page}</span>{' '}
        <span className="text-xs">({total} {t('common.results')})</span>
      </p>

      <div className="flex items-center gap-1">
        <PageBtn disabled={current_page <= 1} onClick={() => onChange(current_page - 1)}>
          <ChevronLeft size={16} />
        </PageBtn>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-on-surface-variant dark:text-dark-on-surface-variant text-sm">…</span>
          ) : (
            <PageBtn
              key={p}
              active={p === current_page}
              onClick={() => onChange(p)}
            >
              {p}
            </PageBtn>
          ),
        )}

        <PageBtn disabled={current_page >= last_page} onClick={() => onChange(current_page + 1)}>
          <ChevronRight size={16} />
        </PageBtn>
      </div>
    </div>
  );
}

function PageBtn({ children, active, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-150',
        active
          ? 'bg-secondary text-white shadow-sm'
          : 'text-on-surface-variant dark:text-dark-on-surface-variant hover:bg-surface-container-low dark:hover:bg-dark-surface-container',
        disabled && 'opacity-30 cursor-not-allowed',
      )}
    >
      {children}
    </button>
  );
}

function buildPageNumbers(current, last) {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);

  const pages = [];
  pages.push(1);
  if (current > 3) pages.push('...');
  for (let p = Math.max(2, current - 1); p <= Math.min(last - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < last - 2) pages.push('...');
  pages.push(last);
  return pages;
}
