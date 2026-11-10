import { createFileRoute } from "@tanstack/react-router";
import { BrandMark, SiteFooter } from "@/components/apply/Brand";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de privacidade — Black Pay Candidaturas" },
      { name: "description", content: "Como a Black Pay trata os dados enviados no portal de candidaturas, conforme a LGPD." },
      { property: "og:title", content: "Política de privacidade — Black Pay" },
      { property: "og:description", content: "Finalidade, uso e direitos sobre os dados enviados nas candidaturas." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

const SECTIONS: [string, string][] = [
  ["Quais dados coletamos", "Nome, idade, cidade e estado, WhatsApp, Instagram (opcional) e as respostas fornecidas no formulário da modalidade escolhida."],
  ["Finalidade", "Os dados são usados exclusivamente para avaliar sua candidatura e entrar em contato pelo WhatsApp informado sobre o processo seletivo."],
  ["Base legal", "Consentimento do titular (art. 7º, I, da LGPD), registrado no momento do envio."],
  ["Acesso e compartilhamento", "Somente a administração autenticada da Black Pay acessa as candidaturas. Os dados não são vendidos nem compartilhados com terceiros."],
  ["Armazenamento", "As informações ficam armazenadas em ambiente protegido pelo tempo necessário ao processo seletivo, ou até que você solicite a exclusão."],
  ["Seus direitos", "Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento, entrando em contato com a Black Pay pelos canais oficiais."],
];

function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto max-w-3xl px-5 py-6"><BrandMark /></header>
      <main className="mx-auto max-w-3xl px-5 pb-16">
        <h1 className="text-3xl font-extrabold uppercase md:text-4xl">Política de privacidade</h1>
        <p className="mt-3 text-muted-foreground">Portal de candidaturas Black Pay — Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
        <div className="mt-10 space-y-6">
          {SECTIONS.map(([t, d]) => (
            <section key={t} className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="text-base font-bold">{t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
