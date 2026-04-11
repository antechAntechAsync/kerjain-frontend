import React from 'react';

export function Button({ className = '', variant = 'primary', size = 'md', children, ...props }) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-full font-heading font-semibold transition-all duration-300 active:scale-95 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-primary text-white hover:shadow-lg',
    secondary: 'bg-secondary text-white hover:shadow-lg',
    outline: 'border border-outline-variant text-primary hover:bg-surface-container-low',
    ghost: 'hover:bg-surface-container-low text-customText',
    glass: 'bg-surface-variant backdrop-blur-[20px] text-primary border border-outline-variant',
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-8 text-lg',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
