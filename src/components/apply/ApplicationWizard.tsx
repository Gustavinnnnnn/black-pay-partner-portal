import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MODALITIES, personalSchema, validateAnswers, type Modality } from "@/lib/applications";
import { submitApplication } from "@/lib/applications.functions";
import { MODALITY_CONTENT } from "./content";
import { OpportunityCard } from "./OpportunityCard";
import { EMPTY_PERSONAL, StepPersonal, type PersonalState } from "./StepPersonal";
import { StepQuestions } from "./StepQuestions";
import { StepReview } from "./StepReview";
import { SuccessScreen } from "./SuccessScreen";

const STEPS = ["Modalidade", "Dados pessoais", "Perguntas", "Revisão", "Confirmação"] as const;

export function ApplicationWizard({ initialModality, onExit }: { initialModality: Modality; onExit: () => void }) {
  const [step, setStep] = useState(2);
  const [modality, setModality] = useState<Modality>(initialModality);
  const [personal, setPersonal] = useState<PersonalState>(EMPTY_PERSONAL);
  const [answersBy, setAnswersBy] = useState<Record<Modality, Record<string, string>>>({ suporte: {}, investidor: {}, expansao: {} });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = useServerFn(submitApplication);

  const mutation = useMutation({
    mutationFn: () =>
      submit({ data: { modality, personal: { ...personal }, answers: answersBy[modality], consent: true } }),
    onSuccess: () => go(5),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Não foi possível enviar. Tente novamente."),
  });

  function go(n: number) {
    setErrors({});
    setStep(n);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function next() {
    if (step === 2) {
      const r = personalSchema.safeParse(personal);
      if (!r.success) {
        const e: Record<string, string> = {};
        for (const issue of r.error.issues) e[String(issue.path[0])] ??= issue.message;
        setErrors(e);
        toast.error("Revise os campos destacados.");
        return;
      }
    }
    if (step === 3) {
      const e = validateAnswers(modality, answersBy[modality]);
      if (Object.keys(e).length) { setErrors(e); toast.error("Revise os campos destacados."); return; }
    }
    if (step === 4) {
      if (!consent) { setErrors({ consent: "É necessário aceitar para enviar a candidatura." }); return; }
      mutation.mutate();
      return;
    }
    go(step + 1);
  }

  if (step === 5) return <SuccessScreen onHome={onExit} />;

  const c = MODALITY_CONTENT[modality];
  const progress = (step / STEPS.length) * 100;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Etapa {step} de {STEPS.length}</span>
          <span className="text-foreground">{STEPS[step - 1]}</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={5}>
          <div className="h-full rounded-full bg-primary-gradient transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div key={step} className="step-enter rounded-3xl border border-border bg-card-gradient p-5 shadow-card md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{c.number} · {c.title}</p>
        <h2 className="mt-2 text-2xl font-extrabold uppercase md:text-3xl">
          {step === 1 ? "Escolha a modalidade" : step === 4 ? "Revise suas informações" : c.formTitle}
        </h2>
        <p className="mt-2 mb-8 text-sm text-muted-foreground">
          {step === 2 ? "Campos com * são obrigatórios." : step === 4 ? "Confira tudo antes de enviar. Você pode editar qualquer seção." : null}
        </p>

        {step === 1 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {MODALITIES.map((m, i) => (
              <OpportunityCard key={m} index={i} content={MODALITY_CONTENT[m]} selected={m === modality}
                onSelect={() => { setModality(m); go(2); }} />
            ))}
          </div>
        ) : step === 2 ? (
          <StepPersonal value={personal} onChange={setPersonal} errors={errors} />
        ) : step === 3 ? (
          <StepQuestions modality={modality} answers={answersBy[modality]} errors={errors}
            onChange={(a) => setAnswersBy((prev) => ({ ...prev, [modality]: a }))} />
        ) : (
          <StepReview modality={modality} personal={personal} answers={answersBy[modality]} consent={consent}
            onConsent={(v) => { setConsent(v); setErrors({}); }} consentError={errors["consent"]} goTo={go} />
        )}

        <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button variant="ghost" size="xl" onClick={() => (step === 1 ? onExit() : go(step - 1))} disabled={mutation.isPending}>
            <ArrowLeft aria-hidden="true" /> Voltar
          </Button>
          {step !== 1 ? (
            <Button variant="hero" size="xl" onClick={next} disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
              {step === 4 ? c.submitLabel : "Continuar"}
              {step !== 4 && !mutation.isPending ? <ArrowRight aria-hidden="true" /> : null}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
