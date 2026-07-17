import type { ReactNode } from "react";

export function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="font-body-sm text-body-sm font-medium text-on-surface">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClasses =
  "rounded-full border border-silver-border bg-cream-paper px-input-padding-x py-input-padding-y text-body-md focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors duration-200";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClasses} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`resize-none rounded-2xl border border-silver-border bg-cream-paper px-input-padding-x py-input-padding-y text-body-md focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors duration-200 ${
        props.className ?? ""
      }`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`appearance-none rounded-full border border-silver-border bg-cream-paper bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231b1b1b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.25em] bg-[position:right_1.5rem_center] bg-no-repeat px-input-padding-x py-input-padding-y pr-10 text-body-md transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${
        props.className ?? ""
      }`}
    />
  );
}
