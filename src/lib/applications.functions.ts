import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { OPEN_MODALITIES, QUESTIONS, submissionSchema, validateAnswers } from "./applications";

/**
 * Public endpoint: visitors submit an application. Input is re-validated here;
 * the insert uses the publishable key, so RLS only allows INSERT (never reads).
 */
export const submitApplication = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => submissionSchema.parse(input))
  .handler(async ({ data }) => {
    if (!OPEN_MODALITIES.includes(data.modality)) throw new Error("Esta modalidade não está aberta no momento.");
    const errors = validateAnswers(data.modality, data.answers);
    if (Object.keys(errors).length) throw new Error("Respostas inválidas. Revise o formulário.");

    // Keep only known question ids for this modality.
    const answers: Record<string, string> = {};
    for (const q of QUESTIONS[data.modality]) {
      const v = (data.answers[q.id] ?? "").trim();
      if (v) answers[q.id] = v;
    }

    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) throw new Error("Serviço indisponível no momento.");

    const supabase = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const p = data.personal;
    const { error } = await supabase.from("applications").insert({
      modality: data.modality,
      full_name: p.full_name,
      age: p.age,
      city_state: p.city_state,
      whatsapp: p.whatsapp,
      instagram: p.instagram ? p.instagram.replace(/^@?/, "@") : null,
      answers,
      consent: true,
    });
    if (error) {
      console.error("submitApplication insert failed", error.message);
      throw new Error("Não foi possível enviar sua candidatura. Tente novamente.");
    }
    return { ok: true as const };
  });
