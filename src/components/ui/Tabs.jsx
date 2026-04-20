import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Tabs — pill-style tab switcher inspired by auth_suite.html login/signup toggle.
 *
 * Usage:
 *   <Tabs value={active} onChange={setActive} tabs={[
 *     { value: 'login', label: 'Login' },
 *     { value: 'register', label: 'Register' },
 *   ]} />
 */
export default function Tabs({ value, onChange, tabs, className }) {
  return (
    <div
      className={cn(
        'inline-flex p-1 bg-surface-container-low dark:bg-dark-surface-container-low rounded-full',
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={cn(
              'px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200',
              isActive
                ? 'bg-surface-container-lowest dark:bg-dark-surface-container-highest text-primary dark:text-dark-primary shadow-sm'
                : 'text-on-surface-variant dark:text-dark-on-surface-variant hover:text-primary dark:hover:text-dark-primary',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
