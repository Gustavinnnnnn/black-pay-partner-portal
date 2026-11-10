import type { Database } from "@/integrations/supabase/types";
import type { Status } from "@/lib/applications";

export type ApplicationRow = Database["public"]["Tables"]["applications"]["Row"];

export const STATUS_STYLE: Record<Status, string> = {
  nova: "border-primary/40 bg-accent text-foreground",
  em_analise: "border-warning/40 bg-warning/10 text-warning",
  em_negociacao: "border-chart-2/30 bg-secondary text-foreground",
  aprovada: "border-success/40 bg-success/10 text-success",
  recusada: "border-border bg-muted text-muted-foreground",
};

export const formatPhone = (d: string) =>
  d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : d.length === 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}` : d;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
