import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ModalityContent } from "./content";

export interface OpportunityCardProps {
  content: ModalityContent;
  selected?: boolean;
  onSelect: () => void;
  index: number;
}

export function OpportunityCard({ content, selected, onSelect, index }: OpportunityCardProps) {
  const Icon = content.icon;
  return (
    <article
      className={cn(
        "step-enter group relative flex flex-col rounded-2xl border bg-card-gradient p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50",
        selected ? "border-primary" : "border-border",
      )}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="flex items-start justify-between">
        <span className="flex size-12 items-center justify-center rounded-xl border border-primary/30 bg-accent text-primary">
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <span className="font-display text-sm font-semibold text-muted-foreground">{content.number}</span>
      </div>
      <h3 className="mt-6 text-xl font-bold text-foreground">{content.title}</h3>
      <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-primary">{content.tag}</p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{content.summary}</p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">{content.detail}</p>
      <div className="mt-auto pt-6">
        <Button variant={selected ? "hero" : "subtle"} size="xl" className="w-full" onClick={onSelect}>
          {selected ? <Check aria-hidden="true" /> : null}
          {content.cta}
          {!selected ? <ArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-1" /> : null}
        </Button>
      </div>
    </article>
  );
}
