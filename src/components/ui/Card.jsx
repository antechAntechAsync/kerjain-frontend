import React from 'react';

export function Card({ className = '', ...props }) {
  return (
    <div
      className={`rounded-sq-md bg-surface-container-lowest text-customText shadow-ambient border-none ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = '', ...props }) {
  return <div className={`flex flex-col space-y-1.5 p-6 border-b border-outline-variant ${className}`} {...props} />;
}

export function CardTitle({ className = '', ...props }) {
  return (
    <h3
      className={`font-heading font-bold leading-none tracking-tight text-primary ${className}`}
      {...props}
    />
  );
}

export function CardContent({ className = '', ...props }) {
  return <div className={`p-6 ${className}`} {...props} />;
}
