import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  sub?: string;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder,
  icon: Icon,
  disabled,
  error,
}: {
  options: DropdownOption[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon?: React.ElementType;
  disabled?: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all duration-200
          ${disabled ? "bg-slate-50 text-brand-muted/60 cursor-not-allowed border-brand-border/50" : "bg-white cursor-pointer hover:border-teal/60"}
          ${open ? "border-teal ring-2 ring-teal/10" : "border-brand-border"}
          ${error ? "border-rose-400" : ""}
        `}
      >
        {Icon && <Icon className="w-5 h-5 text-brand-muted/70 shrink-0" />}
        <span className={`flex-1 truncate ${selected ? "text-brand-ink" : "text-brand-muted/60"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-brand-muted/60 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-brand-border rounded-2xl shadow-xl overflow-hidden">
          <div className="max-h-56 overflow-y-auto py-1.5">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                disabled={opt.disabled}
                onClick={() => {
                  if (!opt.disabled) { onChange(opt.value); setOpen(false); }
                }}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between gap-3 transition-colors
                  ${opt.disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-teal-tint/40 cursor-pointer"}
                  ${opt.value === value ? "bg-teal-tint text-teal font-semibold" : "text-brand-ink"}
                `}
              >
                <div>
                  <span>{opt.label}</span>
                  {opt.sub && <span className="block text-xs text-brand-muted/60 mt-0.5">{opt.sub}</span>}
                </div>
                {opt.value === value && <Check className="w-4 h-4 text-teal shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
    </div>
  );
}
