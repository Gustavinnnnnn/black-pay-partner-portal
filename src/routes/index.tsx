import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { OPEN_MODALITIES, type Modality } from "@/lib/applications";
import { MODALITY_CONTENT } from "@/components/apply/content";
import { OpportunityCard } from "@/components/apply/OpportunityCard";
import { ApplicationWizard } from "@/components/apply/ApplicationWizard";
import { BrandMark, SiteFooter } from "@/components/apply/Brand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Faça parte da Black Pay — Candidaturas oficiais" },
      { name: "description", content: "Candidate-se para Suporte, Sócio Investidor ou Sócio de Expansão e participe do crescimento da Black Pay, gateway de pagamentos." },
      { property: "og:title", content: "Faça parte da Black Pay" },
      { property: "og:description", content: "Portal oficial de candidaturas: Suporte, Sócio Investidor e Sócio de Expansão." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [chosen, setChosen] = useState<Modality | null>(null);

  const start = (m: Modality) => {
    setChosen(m);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-hero" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[640px] grid-lines" aria-hidden="true" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <BrandMark />
        <span className="hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground sm:inline-flex">
          <Lock className="size-3.5 text-primary" aria-hidden="true" /> Ambiente seguro
        </span>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 pb-20">
        {chosen ? (
          <div className="pt-6">
            <ApplicationWizard key={chosen} initialModality={chosen} onExit={() => setChosen(null)} />
          </div>
        ) : (
          <>
            <section className="step-enter mx-auto max-w-3xl pt-10 pb-14 text-center md:pt-20">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-accent/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" /> Processo seletivo aberto
              </span>
              <h1 className="mt-6 text-4xl font-extrabold uppercase leading-[1.05] md:text-6xl">
                Faça parte da <span className="text-primary">Black Pay</span>
              </h1>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                Estamos abrindo oportunidades para pessoas que desejam participar do crescimento de uma operação de
                pagamentos já em funcionamento.
              </p>
              <p className="mt-3 text-base text-foreground/85 md:text-lg">
                Buscamos pessoas com visão de negócio, comprometimento e interesse em construir algo grande.
              </p>
            </section>

            <section aria-labelledby="oportunidades">
              <h2 id="oportunidades" className="sr-only">Oportunidades</h2>
              <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
                {OPEN_MODALITIES.map((m, i) => (
                  <OpportunityCard key={m} index={i} content={MODALITY_CONTENT[m]} onSelect={() => start(m)} />
                ))}
              </div>
            </section>

            <section className="mt-14 grid gap-4 rounded-2xl border border-border bg-surface p-6 text-sm text-muted-foreground md:grid-cols-3">
              {[
                ["Análise individual", "Cada candidatura é avaliada pela administração da Black Pay."],
                ["Sem promessas de retorno", "Condições e participações são negociadas individualmente, em contrato."],
                ["Dados protegidos", "Suas informações são usadas apenas para o processo seletivo (LGPD)."],
              ].map(([t, d]) => (
                <div key={t} className="flex gap-3">
                  <ShieldCheck className="size-5 shrink-0 text-primary" aria-hidden="true" />
                  <div><p className="font-semibold text-foreground">{t}</p><p className="mt-1">{d}</p></div>
                </div>
              ))}
            </section>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
