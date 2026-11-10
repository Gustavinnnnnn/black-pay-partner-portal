import type { LucideIcon } from "lucide-react";
import { Headset, TrendingUp, Megaphone } from "lucide-react";
import type { Modality } from "@/lib/applications";

export interface ModalityContent {
  id: Modality;
  number: string;
  icon: LucideIcon;
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
    number: "01",
    icon: Headset,
    title: "Suporte",
    tag: "Entrada gratuita",
    summary: "Ajude a cuidar da comunidade, atender sellers e fortalecer o relacionamento com os usuários da Black Pay.",
    detail: "Remuneração variável por indicação de novos sellers e possibilidade de bônus por desempenho.",
    cta: "Candidatar-se",
    formTitle: "Candidatura — Equipe de Suporte",
    formDescription: "Estamos procurando pessoas comunicativas, responsáveis e organizadas para ajudar a cuidar da comunidade Black Pay.",
    infoTitle: "Como funciona",
    info: [
      "Não existe taxa de entrada.",
      "Não existe salário fixo garantido.",
      "A remuneração será baseada em comissões por sellers efetivamente indicados e ativados.",
      "Poderão existir bônus por desempenho.",
      "As regras de comissão serão apresentadas durante a seleção.",
    ],
    submitLabel: "Enviar candidatura",
  },
  investidor: {
    id: "investidor",
    number: "02",
    icon: TrendingUp,
    title: "Sócio investidor",
    tag: "A partir de R$ 5.000",
    summary: "Para pessoas que desejam participar financeiramente do crescimento da Black Pay, sem necessidade de trabalhar na operação.",
    detail: "Participação econômica negociada conforme o investimento e os termos do acordo.",
    cta: "Tenho interesse",
    formTitle: "Candidatura — Sócio Investidor",
    formDescription:
      "A Black Pay está avaliando a entrada de novos parceiros financeiros interessados em participar do crescimento da operação. Essa modalidade é destinada a pessoas que desejam investir capital e participar economicamente do negócio, sem assumir funções operacionais.",
    infoTitle: "Informações importantes",
    info: [
      "Investimento mínimo de R$ 5.000.",
      "Não existe obrigação de trabalhar na operação.",
      "A participação econômica será negociada individualmente.",
      "Investimentos maiores poderão justificar condições diferentes.",
      "Não existe promessa de lucro ou retorno garantido.",
      "A entrada depende de aprovação e formalização contratual.",
    ],
    submitLabel: "Enviar proposta de investimento",
  },
  expansao: {
    id: "expansao",
    number: "03",
    icon: Megaphone,
    title: "Sócio de divulgação e expansão",
    tag: "Investimento a negociar",
    summary: "Para pessoas que desejam participar ativamente do crescimento da Black Pay, cuidando de comunidades, divulgação, redes sociais e captação de novos sellers.",
    detail: "Investimento obrigatório de entrada, com valor a negociar. Participação nos resultados negociada conforme investimento, dedicação e responsabilidades.",
    cta: "Candidatar-se",
    formTitle: "Candidatura — Sócio de Expansão",
    formDescription:
      "Estamos buscando um parceiro para assumir uma parte importante do crescimento da Black Pay. Essa pessoa será responsável por fortalecer nossa comunidade, desenvolver novos canais de divulgação, administrar grupos e ajudar a conquistar novos sellers.",
    infoTitle: "Condições",
    info: [
      "Investimento obrigatório para entrada.",
      "Valor negociado conforme perfil e proposta.",
      "Participação econômica negociada.",
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
