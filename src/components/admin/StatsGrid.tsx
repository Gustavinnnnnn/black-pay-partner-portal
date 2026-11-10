import { MODALITY_LABEL, OPEN_MODALITIES, type Modality } from "@/lib/applications";
import type { ApplicationRow } from "./types";

export function StatsGrid({ rows }: { rows: ApplicationRow[] }) {
  const count = (fn: (r: ApplicationRow) => boolean) => rows.filter(fn).length;
  const stats: [string, number, boolean?][] = [
    ["Total", rows.length, true],
    ...OPEN_MODALITIES.map((m) => [MODALITY_LABEL[m], count((r) => r.modality === m)] as [string, number]),
    ["Pendentes", count((r) => ["nova", "em_analise", "em_negociacao"].includes(r.status))],
    ["Aprovadas", count((r) => r.status === "aprovada")],
    ["Recusadas", count((r) => r.status === "recusada")],
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {stats.map(([label, value, highlight]) => (
        <div key={label} className={`rounded-2xl border p-4 ${highlight ? "border-primary/40 bg-accent/50" : "border-border bg-surface"}`}>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-extrabold">{value}</p>
        </div>
      ))}
    </div>
  );
}
