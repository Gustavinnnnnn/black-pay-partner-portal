import { z } from "zod";

/** Shared (client + server) definitions for the Black Pay application flow. */

export const MODALITIES = ["suporte", "investidor", "expansao"] as const;
export type Modality = (typeof MODALITIES)[number];
/** Modalities currently open to the public, in display order. */
export const OPEN_MODALITIES: readonly Modality[] = ["expansao", "suporte"];

export const STATUSES = ["nova", "em_analise", "em_negociacao", "aprovada", "recusada"] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<Status, string> = {
  nova: "Nova candidatura",
  em_analise: "Em análise",
  em_negociacao: "Em negociação",
  aprovada: "Aprovada",
  recusada: "Recusada",
};

export const MODALITY_LABEL: Record<Modality, string> = {
  suporte: "Suporte",
  investidor: "Sócio investidor",
  expansao: "Sócio de expansão",
};

export type QuestionType = "text" | "textarea" | "select";

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  options?: readonly string[];
  required: boolean;
  placeholder?: string;
  /** For select questions: the only accepted answer (e.g. risk awareness). */
  mustEqual?: string;
}

const YES_NO = ["Sim", "Não"] as const;
const HOURS = ["Até 2 horas", "De 2 a 4 horas", "De 4 a 6 horas", "Mais de 6 horas"] as const;
export const INVEST_RANGES = [
  "R$ 5.000 a R$ 10.000",
  "R$ 10.000 a R$ 20.000",
  "R$ 20.000 a R$ 30.000",
  "R$ 30.000 a R$ 50.000",
  "Acima de R$ 50.000",
] as const;
const RISK_OK = "Sim, estou ciente dos riscos";
export const ENTRY_OK = "Sim, estou ciente e de acordo";

export const QUESTIONS: Record<Modality, readonly Question[]> = {
  suporte: [
    { id: "atendimento", label: "Você já trabalhou com atendimento?", type: "select", options: YES_NO, required: true },
    { id: "grupos", label: "Você já administrou grupos de Telegram ou WhatsApp?", type: "select", options: YES_NO, required: true },
    { id: "vendas", label: "Você tem experiência com vendas ou indicação de clientes?", type: "select", options: YES_NO, required: true },
    { id: "horas", label: "Quantas horas por dia pode dedicar?", type: "select", options: HOURS, required: true },
    { id: "motivo", label: "Por que deseja fazer parte da Black Pay?", type: "textarea", required: true },
    { id: "sobre", label: "Conte um pouco sobre você e sua experiência.", type: "textarea", required: true },
  ],
  investidor: [
    { id: "valor", label: "Quanto pretende investir? (mínimo de R$ 5.000)", type: "select", options: INVEST_RANGES, required: true },
    { id: "experiencia", label: "Você possui experiência com investimentos ou negócios digitais?", type: "select", options: YES_NO, required: true },
    { id: "objetivo", label: "Qual é seu principal objetivo ao entrar na Black Pay?", type: "textarea", required: true },
    {
      id: "ciente_riscos",
      label: "Está ciente de que o investimento envolve riscos e não garante retorno financeiro?",
      type: "select",
      options: [RISK_OK, "Não"],
      mustEqual: RISK_OK,
      required: true,
    },
    { id: "observacao", label: "Deseja deixar alguma observação?", type: "textarea", required: false },
  ],
  expansao: [
    { id: "comunidades", label: "Você já administrou comunidades ou grupos?", type: "select", options: YES_NO, required: true },
    { id: "atendimento", label: "Tem experiência com atendimento ao cliente?", type: "select", options: YES_NO, required: true },
    { id: "marketing", label: "Já trabalhou com divulgação ou marketing?", type: "select", options: YES_NO, required: true },
    { id: "redes", label: "Tem experiência com Instagram, TikTok ou outras redes sociais?", type: "select", options: YES_NO, required: true },
    { id: "horas", label: "Quantas horas por dia pode dedicar?", type: "select", options: HOURS, required: true },
    {
      id: "investimento",
      label: "Está ciente de que a entrada custa R$ 2.000 (valor fixo)?",
      type: "select",
      options: [ENTRY_OK, "Não"],
      mustEqual: ENTRY_OK,
      required: true,
    },
    { id: "capacidade", label: "Você tem capacidade de organizar e administrar uma comunidade?", type: "select", options: YES_NO, required: true },
    { id: "como_crescer", label: "Como pretende ajudar a Black Pay a crescer?", type: "textarea", required: true },
    { id: "por_que", label: "Por que deveríamos escolher você?", type: "textarea", required: true },
    { id: "proposta", label: "Apresente sua proposta e fale sobre sua experiência.", type: "textarea", required: true },
  ],
};

/** Strips non-digits; WhatsApp is stored as 10–13 digits (optionally with 55). */
export const onlyDigits = (v: string): string => v.replace(/\D/g, "");

/** Brazilian phone mask: (11) 91234-5678 */
export function maskWhatsapp(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export const personalSchema = z.object({
  full_name: z.string().trim().min(3, "Informe seu nome completo").max(120, "Máximo de 120 caracteres")
    .refine((v) => v.split(/\s+/).length >= 2, "Informe nome e sobrenome"),
  age: z.preprocess((v) => (v === "" || v == null ? undefined : v),
    z.coerce.number({ required_error: "Informe sua idade", invalid_type_error: "Informe sua idade" }).int("Idade inválida")
    .min(18, "É necessário ter 18 anos ou mais").max(100, "Idade inválida")),
  city_state: z.string().trim().min(3, "Informe cidade e estado").max(120, "Máximo de 120 caracteres"),
  whatsapp: z.string().transform(onlyDigits)
    .refine((v) => v.length === 10 || v.length === 11, "WhatsApp inválido. Use DDD + número"),
  instagram: z.string().trim().max(60, "Máximo de 60 caracteres")
    .regex(/^@?[A-Za-z0-9._]*$/, "Use apenas o usuário, ex.: @seuperfil").optional().default(""),
});
export type PersonalInput = z.input<typeof personalSchema>;

/** Validates answers for one modality. Returns field -> error message. */
export function validateAnswers(modality: Modality, answers: Record<string, string>): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const q of QUESTIONS[modality]) {
    const v = (answers[q.id] ?? "").trim();
    if (q.required && !v) { errors[q.id] = "Campo obrigatório"; continue; }
    if (!v) continue;
    if (v.length > 2000) errors[q.id] = "Máximo de 2000 caracteres";
    else if (q.type === "select" && q.options && !q.options.includes(v)) errors[q.id] = "Selecione uma opção válida";
    else if (q.mustEqual && v !== q.mustEqual) errors[q.id] = "É necessário estar ciente dos riscos para prosseguir";
    else if (q.type === "textarea" && q.required && v.length < 10) errors[q.id] = "Escreva pelo menos 10 caracteres";
  }
  return errors;
}

export const submissionSchema = z.object({
  modality: z.enum(MODALITIES),
  personal: personalSchema,
  answers: z.record(z.string().max(2000)),
  consent: z.literal(true, { errorMap: () => ({ message: "É necessário aceitar a política de privacidade" }) }),
  website: z.string().max(0).optional(), // honeypot
});
export type SubmissionInput = z.input<typeof submissionSchema>;
