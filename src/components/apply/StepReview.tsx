import { Link } from "@tanstack/react-router";
import { Pencil, ShieldCheck } from "lucide-react";
import { MODALITY_LABEL, QUESTIONS, type Modality } from "@/lib/applications";
import { Checkbox } from "@/components/ui/checkbox";
import type { PersonalState } from "./StepPersonal";

interface Props {
  modality: Modality;
  personal: PersonalState;
  answers: Record<string, string>;
  consent: boolean;
  onConsent: (v: boolean) => void;
  consentError?: string;
  goTo: (step: number) => void;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border py-3 last:border-0">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-foreground">{value || "—"}</dd>
    </div>
  );
}

function Section({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h4 className="font-display text-sm font-bold uppercase tracking-wider">{title}</h4>
        <button type="button" onClick={onEdit} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
          <Pencil className="size-3" aria-hidden="true" /> Editar
        </button>
      </div>
      <dl className="mt-2">{children}</dl>
    </section>
  );
}

export function StepReview({ modality, personal, answers, consent, onConsent, consentError, goTo }: Props) {
  return (
    <div className="space-y-5">
      <Section title="Modalidade" onEdit={() => goTo(1)}>
        <Row label="Oportunidade escolhida" value={MODALITY_LABEL[modality]} />
      </Section>
      <Section title="Informações pessoais" onEdit={() => goTo(2)}>
        <Row label="Nome completo" value={personal.full_name} />
        <Row label="Idade" value={personal.age} />
        <Row label="Cidade e estado" value={personal.city_state} />
        <Row label="WhatsApp" value={personal.whatsapp} />
        <Row label="Instagram" value={personal.instagram} />
      </Section>
      <Section title="Respostas" onEdit={() => goTo(3)}>
        {QUESTIONS[modality].map((q) => <Row key={q.id} label={q.label} value={answers[q.id] ?? ""} />)}
      </Section>

      <div className={`rounded-2xl border p-5 ${consentError ? "border-destructive" : "border-primary/30"} bg-accent/30`}>
        <div className="flex gap-3">
          <ShieldCheck className="size-5 shrink-0 text-primary" aria-hidden="true" />
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Privacidade (LGPD).</strong> Seus dados serão usados exclusivamente para
              avaliar sua candidatura e entrar em contato pelo WhatsApp informado. Eles são acessados apenas pela
              administração da Black Pay e não são compartilhados com terceiros. Você pode solicitar a exclusão a qualquer momento.{" "}
              <Link to="/privacidade" target="_blank" className="font-semibold text-primary hover:underline">Ler política completa</Link>
            </p>
            <label htmlFor="consent" className="flex cursor-pointer items-start gap-3 text-foreground">
              <Checkbox id="consent" checked={consent} onCheckedChange={(v) => onConsent(v === true)} className="mt-0.5" />
              <span>Li e concordo com o tratamento dos meus dados para fins de seleção. <span className="text-primary">*</span></span>
            </label>
            {consentError ? <p role="alert" className="text-xs font-medium text-destructive">{consentError}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
