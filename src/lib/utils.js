import { clsx } from 'clsx';

/**
 * Merge class names with clsx.
 * Usage: cn('base-class', conditional && 'active', className)
 */
export function cn(...args) {
  return clsx(...args);
}

/**
 * Format a date to relative time (e.g., "2 jam lalu").
 * Uses Intl.RelativeTimeFormat for i18n support.
 */
export function formatRelativeTime(dateString, locale = 'id') {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffDay > 30) {
    return formatDate(dateString, locale);
  } else if (diffDay > 0) {
    return rtf.format(-diffDay, 'day');
  } else if (diffHour > 0) {
    return rtf.format(-diffHour, 'hour');
  } else if (diffMin > 0) {
    return rtf.format(-diffMin, 'minute');
  } else {
    return rtf.format(-diffSec, 'second');
  }
}

/**
 * Format a date string to locale date.
 */
export function formatDate(dateString, locale = 'id') {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a number to compact notation (e.g., 12.4K).
 */
export function formatCompactNumber(num) {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
}

/**
 * Build query string from an object.
 * Omits null, undefined, and empty string values.
 */
export function buildQueryString(params) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get initials from a name (e.g., "John Doe" → "JD").
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Truncate text to a max length with ellipsis.
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Map employment type to display label.
 */
export const employmentTypeLabels = {
  internship: 'Internship',
  part_time: 'Part Time',
  full_time: 'Full Time',
  contract: 'Contract',
  daily_worker: 'Daily Worker',
};

/**
 * Map site type to display label.
 */
export const siteTypeLabels = {
  wfo: 'WFO',
  wfh: 'WFH',
  hybrid: 'Hybrid',
};

/**
 * Get match score color based on percentage.
 */
export function getMatchScoreColor(score) {
  if (score >= 80) return 'text-success';
  if (score >= 50) return 'text-secondary';
  if (score >= 30) return 'text-warning';
  return 'text-error';
}
