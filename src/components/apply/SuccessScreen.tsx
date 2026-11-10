import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SuccessScreen({ onHome }: { onHome: () => void }) {
  return (
    <div className="step-enter mx-auto max-w-xl py-10 text-center">
      <div className="mx-auto flex size-20 items-center justify-center rounded-full border border-primary/40 bg-accent shadow-glow">
        <CheckCircle2 className="size-10 text-primary" aria-hidden="true" />
      </div>
      <h2 className="mt-8 text-3xl font-extrabold uppercase md:text-4xl">Candidatura recebida!</h2>
      <div className="mt-5 space-y-4 text-muted-foreground">
        <p>Recebemos suas informações com sucesso.</p>
        <p>
          Nossa equipe irá analisar sua candidatura e, caso seu perfil esteja alinhado com a oportunidade
          escolhida, entraremos em contato pelo WhatsApp informado.
        </p>
        <p className="text-foreground">Agradecemos seu interesse em fazer parte da Black Pay.</p>
      </div>
      <Button variant="hero" size="xl" className="mt-10" onClick={onHome}>Voltar ao início</Button>
    </div>
  );
}
