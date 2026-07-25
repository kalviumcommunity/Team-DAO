import React, { InputHTMLAttributes, useId } from 'react';

interface PillInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function PillInput({ label, className = '', id, ...props }: PillInputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={`flex flex-col gap-2 focus-within:scale-[1.02] transition-transform ${className}`}>
      {label && (
        <label htmlFor={inputId} className="font-label-caps text-[12px] text-stone-charcoal px-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className="w-full h-[52px] px-[24px] py-[14px] rounded-full border border-silver-border bg-white text-body-md focus:outline-none focus:ring-2 focus:ring-[#82ff87] focus:border-[#82ff87] transition-all placeholder:text-silver-border"
        {...props}
      />
    </div>
  );
}
