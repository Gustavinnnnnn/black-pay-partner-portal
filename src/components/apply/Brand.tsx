import { Link } from "@tanstack/react-router";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Black Pay — início">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary-gradient font-display text-sm font-extrabold text-primary-foreground shadow-glow">
        BP
      </span>
      <span className="font-display text-lg font-extrabold tracking-tight">
        BLACK <span className="text-primary">PAY</span>
      </span>
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-5 py-8 text-center text-xs text-muted-foreground">
      <p>© {new Date().getFullYear()} Black Pay. Portal oficial de candidaturas.</p>
      <p className="mt-2">
        <Link to="/privacidade" className="hover:text-foreground">Política de privacidade</Link>
      </p>
    </footer>
  );
}
