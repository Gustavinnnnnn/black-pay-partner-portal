import type { Modality } from "@/lib/applications";

export interface ModalityContent {
  id: Modality;
  number: string;
  title: string;
  tag: string;
  summary: string;
  detail: string;
  cta: string;
  formTitle: string;
  formDescription: string;
  infoTitle: string;
  info: string[];
  responsibilities?: string[];
  submitLabel: string;
}

export const MODALITY_CONTENT: Record<Modality, ModalityContent> = {
  suporte: {
    id: "suporte",
    number: "02",
    title: "Suporte",
    tag: "Entrada gratuita",
    summary: "Entre sem pagar nada e ajude a atender sellers e cuidar da comunidade Black Pay.",
    detail: "Não paga para entrar, mas o ganho vem do trabalho: atendimento, suporte e novos sellers trazidos.",
    cta: "Candidatar-se",
    formTitle: "Candidatura — Equipe de Suporte",
    formDescription: "Estamos procurando pessoas comunicativas, responsáveis e organizadas para atender sellers e cuidar da comunidade Black Pay.",
    infoTitle: "Como funciona",
    info: [
      "Entrada gratuita: você não paga nada para entrar.",
      "Você ganha trabalhando: os ganhos vêm do seu desempenho no suporte.",
      "Você também pode ganhar por trazer novos sellers para a plataforma.",
      "Funções e responsabilidades são definidas em acordo.",
    ],
    submitLabel: "Enviar candidatura",
  },
  investidor: {
    id: "investidor",
    number: "03",
    title: "Sócio investidor",
    tag: "A partir de R$ 5.000",
    summary: "Para quem quer apenas investir dinheiro na Black Pay, sem precisar trabalhar na operação.",
    detail: "Investimento mínimo de R$ 5.000. Em troca, você recebe uma porcentagem da plataforma, definida em acordo.",
    cta: "Tenho interesse",
    formTitle: "Candidatura — Sócio Investidor",
    formDescription:
      "Essa modalidade é para quem deseja investir capital na Black Pay e participar dos resultados com uma porcentagem da plataforma, sem assumir nenhuma função operacional.",
    infoTitle: "Como funciona",
    info: [
      "Investimento mínimo de R$ 5.000.",
      "Você só investe: não precisa trabalhar na operação.",
      "Você recebe uma porcentagem da plataforma, definida conforme o valor investido.",
      "Não existe promessa de lucro ou retorno garantido.",
      "A entrada depende de aprovação e contrato formal.",
    ],
    submitLabel: "Enviar proposta de investimento",
  },
  expansao: {
    id: "expansao",
    number: "01",
    title: "Gerente da plataforma",
    tag: "Entrada de R$ 2.000",
    summary: "Para quem quer participar ativamente do crescimento: comunidades, divulgação, redes sociais e captação de sellers.",
    detail: "Entrada fixa de R$ 2.000. A porcentagem que você recebe é debatida conforme o quanto você pode ajudar a plataforma.",
    cta: "Candidatar-se",
    formTitle: "Candidatura — Gerente da Plataforma",
    formDescription:
      "Buscamos um gerente para cuidar do crescimento da Black Pay: fortalecer a comunidade, abrir novos canais de divulgação, administrar grupos e trazer novos sellers.",
    infoTitle: "Condições",
    info: [
      "Entrada fixa de R$ 2.000 para entrar.",
      "Porcentagem debatida conforme o quanto você pode ajudar a plataforma.",
      "Responsabilidades e metas definidas em contrato.",
      "Período inicial de avaliação e adaptação.",
    ],
    responsibilities: [
      "Administração dos grupos oficiais",
      "Criação de novos grupos de networking",
      "Atendimento inicial aos sellers",
      "Organização da comunidade",
      "Administração de Instagram e TikTok",
      "Produção e publicação de conteúdos",
      "Estratégias de divulgação",
      "Captação de novos sellers",
      "Desenvolvimento de parcerias",
      "Expansão da presença digital da Black Pay",
    ],
    submitLabel: "Enviar candidatura",
  },
};
