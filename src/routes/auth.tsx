import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/apply/fields";
import { BrandMark } from "@/components/apply/Brand";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acesso administrativo — Black Pay" },
      { name: "description", content: "Área restrita da administração Black Pay." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Acesso administrativo — Black Pay" },
      { property: "og:description", content: "Área restrita." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const r = schema.safeParse({ email, password });
    if (!r.success) {
      const errs: Record<string, string> = {};
      for (const i of r.error.issues) errs[String(i.path[0])] ??= i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword(r.data);
        if (error) throw error;
        navigate({ to: "/admin", replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({ ...r.data, options: { emailRedirectTo: `${window.location.origin}/admin` } });
        if (error) throw error;
        if (data.session) navigate({ to: "/admin", replace: true });
        else setSent(true);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      toast.error(msg.includes("Invalid login") ? "E-mail ou senha incorretos." : msg || "Não foi possível continuar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-5">
      <div className="pointer-events-none absolute inset-0 bg-hero" aria-hidden="true" />
      <div className="step-enter relative w-full max-w-md rounded-3xl border border-border bg-card-gradient p-7 shadow-card">
        <BrandMark />
        <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          <Lock className="size-3.5" aria-hidden="true" /> Área administrativa
        </div>
        <h1 className="mt-2 text-2xl font-extrabold">{mode === "signin" ? "Entrar no painel" : "Criar conta de administrador"}</h1>
        {sent ? (
          <p className="mt-6 rounded-xl border border-primary/30 bg-accent/40 p-4 text-sm text-foreground">
            Enviamos um link de confirmação para <strong>{email}</strong>. Confirme o e-mail e depois entre no painel.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
            <Field id="email" label="E-mail" required error={errors["email"]}>
              <input id="email" type="email" autoComplete="email" className={inputClass(!!errors["email"])} value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field id="password" label="Senha" required error={errors["password"]}>
              <input id="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} className={inputClass(!!errors["password"])} value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            <Button type="submit" variant="hero" size="xl" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
              {mode === "signin" ? "Entrar" : "Criar conta"}
            </Button>
          </form>
        )}
        <button type="button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setSent(false); }}
          className="mt-6 w-full text-center text-xs text-muted-foreground hover:text-foreground">
          {mode === "signin" ? "Primeiro acesso? Criar conta de administrador" : "Já tenho conta. Entrar"}
        </button>
      </div>
    </div>
  );
}
