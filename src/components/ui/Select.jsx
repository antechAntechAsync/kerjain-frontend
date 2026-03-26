import React from 'react';

export const Select = React.forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <select
      className={`flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";
