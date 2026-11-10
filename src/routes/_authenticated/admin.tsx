import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Loader2, LogOut, Search, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BrandMark } from "@/components/apply/Brand";
import { inputClass } from "@/components/apply/fields";
import { MODALITIES, MODALITY_LABEL, QUESTIONS, STATUSES, STATUS_LABEL, type Modality, type Status } from "@/lib/applications";
import { downloadCsv, toCsv } from "@/lib/csv";
import { StatsGrid } from "@/components/admin/StatsGrid";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ApplicationDetail } from "@/components/admin/ApplicationDetail";
import { formatDate, formatPhone, whatsappLink, type ApplicationRow } from "@/components/admin/types";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel de candidaturas — Black Pay" },
      { name: "description", content: "Painel administrativo de candidaturas Black Pay." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Painel — Black Pay" },
      { property: "og:description", content: "Área restrita." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const PERIODS = { all: "Todo o período", "7": "Últimos 7 dias", "30": "Últimos 30 dias", "90": "Últimos 90 dias" } as const;
type Period = keyof typeof PERIODS;

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const role = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      // Grants admin to the first account only while no admin exists; otherwise just checks.
      const { data, error } = await supabase.rpc("claim_first_admin");
      if (error) throw error;
      return data === true;
    },
  });

  const apps = useQuery({
    queryKey: ["applications"],
    enabled: role.data === true,
    queryFn: async () => {
      const { data, error } = await supabase.from("applications").select("*").order("created_at", { ascending: false }).limit(1000);
      if (error) throw error;
      return data as ApplicationRow[];
    },
  });

  const [modality, setModality] = useState<Modality | "all">("all");
  const [status, setStatus] = useState<Status | "all">("all");
  const [period, setPeriod] = useState<Period>("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = apps.data ?? [];
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const digits = term.replace(/\D/g, "");
    const since = period === "all" ? 0 : Date.now() - Number(period) * 86400000;
    return rows.filter((r) =>
      (modality === "all" || r.modality === modality) &&
      (status === "all" || r.status === status) &&
      new Date(r.created_at).getTime() >= since &&
      (!term || r.full_name.toLowerCase().includes(term) || (digits.length > 0 && r.whatsapp.includes(digits))));
  }, [rows, modality, status, period, q]);
  const openApp = rows.find((r) => r.id === openId) ?? null;

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  function exportCsv() {
    const qIds = Array.from(new Set(MODALITIES.flatMap((m) => QUESTIONS[m].map((x) => x.id))));
    const headers = ["Data", "Nome", "Modalidade", "Status", "Idade", "Cidade/UF", "WhatsApp", "Instagram", ...qIds, "Observações"];
    const data = filtered.map((r) => {
      const a = (r.answers ?? {}) as Record<string, string>;
      return [formatDate(r.created_at), r.full_name, MODALITY_LABEL[r.modality as Modality], STATUS_LABEL[r.status as Status], r.age, r.city_state, r.whatsapp, r.instagram ?? "", ...qIds.map((id) => a[id] ?? ""), r.admin_notes ?? ""];
    });
    downloadCsv(`candidaturas-blackpay-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(headers, data));
  }

  const selectCls = `${inputClass()} py-2.5`;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <BrandMark />
          <Button variant="ghost" size="sm" onClick={signOut}><LogOut aria-hidden="true" />Sair</Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        {role.isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-primary" aria-label="Carregando" /></div>
        ) : role.data !== true ? (
          <div className="mx-auto max-w-md rounded-3xl border border-border bg-surface p-8 text-center">
            <ShieldAlert className="mx-auto size-10 text-primary" aria-hidden="true" />
            <h1 className="mt-4 text-xl font-bold">Acesso restrito</h1>
            <p className="mt-2 text-sm text-muted-foreground">Esta conta não tem permissão de administrador.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Painel administrativo</p>
                <h1 className="mt-1 text-3xl font-extrabold">Candidaturas</h1>
              </div>
              <Button variant="hero" size="xl" onClick={exportCsv} disabled={!filtered.length}><Download aria-hidden="true" />Exportar CSV</Button>
            </div>

            <div className="mt-6">{apps.isLoading ? <Skeleton className="h-24 w-full rounded-2xl" /> : <StatsGrid rows={rows} />}</div>

            <div className="mt-6 grid gap-3 md:grid-cols-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input aria-label="Buscar por nome ou WhatsApp" className={`${inputClass()} py-2.5 pl-9`} placeholder="Nome ou WhatsApp" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <select aria-label="Modalidade" className={selectCls} value={modality} onChange={(e) => setModality(e.target.value as Modality | "all")}>
                <option value="all">Todas as modalidades</option>
                {MODALITIES.map((m) => <option key={m} value={m}>{MODALITY_LABEL[m]}</option>)}
              </select>
              <select aria-label="Status" className={selectCls} value={status} onChange={(e) => setStatus(e.target.value as Status | "all")}>
                <option value="all">Todos os status</option>
                {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
              <select aria-label="Período" className={selectCls} value={period} onChange={(e) => setPeriod(e.target.value as Period)}>
                {Object.entries(PERIODS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>

            <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-surface">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>{["Nome", "Modalidade", "WhatsApp", "Cidade", "Data", "Status"].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} tabIndex={0} onClick={() => setOpenId(r.id)} onKeyDown={(e) => e.key === "Enter" && setOpenId(r.id)}
                      className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-accent/40 focus-visible:bg-accent/40 focus-visible:outline-none">
                      <td className="px-4 py-3 font-semibold">{r.full_name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{MODALITY_LABEL[r.modality as Modality]}</td>
                      <td className="px-4 py-3">
                        <a href={whatsappLink(r.whatsapp)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                          className="font-semibold text-primary underline-offset-4 hover:underline">{formatPhone(r.whatsapp)}</a>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{r.city_state}</td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(r.created_at)}</td>
                      <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!apps.isLoading && filtered.length === 0 ? (
                <p className="px-4 py-12 text-center text-sm text-muted-foreground">{rows.length ? "Nenhuma candidatura encontrada com esses filtros." : "Ainda não há candidaturas."}</p>
              ) : null}
            </div>
          </>
        )}
      </main>
      <ApplicationDetail app={openApp} onClose={() => setOpenId(null)} />
    </div>
  );
}
