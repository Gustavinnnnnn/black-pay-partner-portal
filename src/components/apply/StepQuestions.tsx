import { CircleCheck } from "lucide-react";
import { QUESTIONS, type Modality } from "@/lib/applications";
import { MODALITY_CONTENT } from "./content";
import { ChoiceGroup, Field, inputClass } from "./fields";

export function StepQuestions({
  modality, answers, onChange, errors,
}: { modality: Modality; answers: Record<string, string>; onChange: (a: Record<string, string>) => void; errors: Record<string, string> }) {
  const c = MODALITY_CONTENT[modality];
  const set = (id: string, v: string) => onChange({ ...answers, [id]: v });
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-primary/25 bg-accent/40 p-5">
        <p className="text-sm leading-relaxed text-muted-foreground">{c.formDescription}</p>
        {c.responsibilities ? (
          <div className="mt-5">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Responsabilidades</h4>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {c.responsibilities.map((r) => (
                <li key={r} className="flex gap-2 text-sm text-foreground/85">
                  <CircleCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />{r}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <h4 className="mt-5 text-sm font-bold uppercase tracking-wider text-foreground">{c.infoTitle}</h4>
        <ul className="mt-3 space-y-2">
          {c.info.map((i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground/85">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />{i}
            </li>
          ))}
        </ul>
      </div>

      {QUESTIONS[modality].map((q, i) => (
        <Field key={q.id} id={`q-${q.id}`} label={`${i + 6}. ${q.label}`} required={q.required} error={errors[q.id]}>
          {q.type === "select" && q.options ? (
            <ChoiceGroup id={`q-${q.id}`} options={q.options} value={answers[q.id] ?? ""} onChange={(v) => set(q.id, v)} hasError={!!errors[q.id]} />
          ) : q.type === "textarea" ? (
            <textarea id={`q-${q.id}`} rows={4} maxLength={2000} className={inputClass(!!errors[q.id])}
              value={answers[q.id] ?? ""} onChange={(e) => set(q.id, e.target.value)} placeholder={q.placeholder ?? "Escreva sua resposta"} />
          ) : (
            <input id={`q-${q.id}`} maxLength={200} className={inputClass(!!errors[q.id])}
              value={answers[q.id] ?? ""} onChange={(e) => set(q.id, e.target.value)} placeholder={q.placeholder} />
          )}
        </Field>
      ))}
    </div>
  );
}
