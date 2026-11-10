import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Copy, Loader2, Search, Trash2, X, Handshake, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MODALITY_LABEL, QUESTIONS, STATUS_LABEL, type Modality, type Status } from "@/lib/applications";
import { inputClass } from "@/components/apply/fields";
import { StatusBadge } from "./StatusBadge";
import { formatDate, formatPhone, whatsappLink, type ApplicationRow } from "./types";

export function ApplicationDetail({ app, onClose }: { app: ApplicationRow | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [notes, setNotes] = useState("");
  useEffect(() => setNotes(app?.admin_notes ?? ""), [app?.id, app?.admin_notes]);

  const events = useQuery({
    queryKey: ["application-events", app?.id],
    enabled: !!app,
    queryFn: async () => {
      const { data, error } = await supabase.from("application_events").select("*").eq("application_id", app!.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const update = useMutation({
    mutationFn: async (patch: { status?: Status; admin_notes?: string | null }) => {
      const { error } = await supabase.from("applications").update(patch).eq("id", app!.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["applications"] }); qc.invalidateQueries({ queryKey: ["application-events", app?.id] }); toast.success("Candidatura atualizada."); },
    onError: () => toast.error("Não foi possível atualizar."),
  });

  const remove = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("applications").delete().eq("id", app!.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["applications"] }); toast.success("Candidatura excluída."); onClose(); },
    onError: () => toast.error("Não foi possível excluir."),
  });

  const answers = (app?.answers ?? {}) as Record<string, string>;

  return (
    <Sheet open={!!app} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto border-border bg-card sm:max-w-xl">
        {app ? (
          <>
            <SheetHeader className="text-left">
              <SheetDescription className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{MODALITY_LABEL[app.modality as Modality]}</SheetDescription>
              <SheetTitle className="font-display text-2xl">{app.full_name}</SheetTitle>
              <div className="flex flex-wrap items-center gap-2"><StatusBadge status={app.status} /><span className="text-xs text-muted-foreground">{formatDate(app.created_at)}</span></div>
            </SheetHeader>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <Button variant="subtle" size="sm" onClick={() => update.mutate({ status: "aprovada" })} disabled={update.isPending}><Check aria-hidden="true" />Aprovar</Button>
              <Button variant="subtle" size="sm" onClick={() => update.mutate({ status: "recusada" })} disabled={update.isPending}><X aria-hidden="true" />Recusar</Button>
              <Button variant="subtle" size="sm" onClick={() => update.mutate({ status: "em_analise" })} disabled={update.isPending}><Search aria-hidden="true" />Em análise</Button>
              <Button variant="subtle" size="sm" onClick={() => update.mutate({ status: "em_negociacao" })} disabled={update.isPending}><Handshake aria-hidden="true" />Em negociação</Button>
            </div>

            <dl className="mt-6 space-y-0 rounded-2xl border border-border bg-surface px-4">
              {[
                ["Idade", String(app.age)],
                ["Cidade e estado", app.city_state],
                ["Instagram", app.instagram ?? "—"],
              ].map(([l, v]) => (
                <div key={l} className="border-b border-border py-3"><dt className="text-xs uppercase tracking-wider text-muted-foreground">{l}</dt><dd className="mt-1 text-sm">{v}</dd></div>
              ))}
              <div className="flex items-center justify-between py-3">
                <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">WhatsApp</dt><dd className="mt-1 text-sm">{formatPhone(app.whatsapp)}</dd></div>
                <div className="flex gap-1">
                  <Button variant="hero" size="sm" asChild><a href={whatsappLink(app.whatsapp)} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />Chamar</a></Button>
                  <Button variant="ghost" size="sm" aria-label="Copiar WhatsApp" onClick={() => { navigator.clipboard.writeText(app.whatsapp); toast.success("WhatsApp copiado."); }}><Copy aria-hidden="true" /></Button>
                </div>
              </div>
            </dl>

            <h3 className="mt-6 text-sm font-bold uppercase tracking-wider">Respostas</h3>
            <dl className="mt-2 rounded-2xl border border-border bg-surface px-4">
              {QUESTIONS[app.modality as Modality].map((q) => (
                <div key={q.id} className="border-b border-border py-3 last:border-0">
                  <dt className="text-xs text-muted-foreground">{q.label}</dt>
                  <dd className="mt-1 whitespace-pre-wrap break-words text-sm">{answers[q.id] || "—"}</dd>
                </div>
              ))}
            </dl>

            <h3 className="mt-6 text-sm font-bold uppercase tracking-wider">Observações internas</h3>
            <textarea rows={4} maxLength={5000} className={`${inputClass()} mt-2`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Visível apenas para a administração" />
            <Button variant="hero" size="sm" className="mt-2" disabled={update.isPending || notes === (app.admin_notes ?? "")}
              onClick={() => update.mutate({ admin_notes: notes.trim() || null })}>
              {update.isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}Salvar observações
            </Button>

            <h3 className="mt-6 text-sm font-bold uppercase tracking-wider">Histórico</h3>
            <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
              {(events.data ?? []).map((ev) => (
                <li key={ev.id} className="rounded-lg border border-border bg-surface px-3 py-2">
                  {formatDate(ev.created_at)} —{" "}
                  {ev.action === "status_change"
                    ? `Status: ${STATUS_LABEL[ev.from_value as Status] ?? ev.from_value} → ${STATUS_LABEL[ev.to_value as Status] ?? ev.to_value}`
                    : "Observações atualizadas"}
                </li>
              ))}
              {events.data?.length === 0 ? <li>Nenhuma alteração registrada.</li> : null}
            </ul>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="mt-8 text-destructive hover:text-destructive"><Trash2 aria-hidden="true" />Excluir candidatura</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-border bg-card">
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir candidatura?</AlertDialogTitle>
                  <AlertDialogDescription>Os dados de {app.full_name} serão removidos permanentemente. Esta ação não pode ser desfeita.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => remove.mutate()}>Excluir</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
