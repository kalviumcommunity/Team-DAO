import React, { ButtonHTMLAttributes } from 'react';

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function PillButton({ variant = 'primary', className = '', children, ...props }: PillButtonProps) {
  let variantStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles = 'vivid-lime-gradient-bg text-black hover:opacity-90';
      break;
    case 'secondary':
      variantStyles = 'bg-black text-white hover:bg-black/90';
      break;
    case 'ghost':
      variantStyles = 'bg-transparent border border-stone-charcoal text-stone-charcoal hover:bg-stone-charcoal/5';
      break;
  }

  return (
    <button
      className={`h-[52px] rounded-full font-medium text-body-md active:scale-[0.98] transition-all flex items-center justify-center px-6 ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
