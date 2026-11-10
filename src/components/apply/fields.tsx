import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Labeled field wrapper with required marker and error message. */
export function Field({
  id, label, required, error, hint, children,
}: { id: string; label: string; required?: boolean | undefined; error?: string | undefined; hint?: string | undefined; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-foreground">
        {label}
        {required ? <span className="ml-1 text-primary" aria-hidden="true">*</span> : (
          <span className="ml-2 text-xs font-normal text-muted-foreground">(opcional)</span>
        )}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? <p id={`${id}-error`} role="alert" className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}

export const inputClass = (hasError?: boolean) =>
  cn(
    "w-full rounded-xl border bg-surface px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring md:text-sm",
    hasError ? "border-destructive" : "border-input",
  );

/** Pill-style single choice group (better than a native select on mobile). */
export function ChoiceGroup({
  id, options, value, onChange, hasError,
}: { id: string; options: readonly string[]; value: string; onChange: (v: string) => void; hasError?: boolean }) {
  return (
    <div role="radiogroup" id={id} aria-invalid={hasError} className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt)}
            className={cn(
              "rounded-xl border px-4 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "border-primary bg-accent text-foreground"
                : hasError
                  ? "border-destructive/60 bg-surface text-muted-foreground hover:text-foreground"
                  : "border-input bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
