export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const FAQ_PADRAO_ADMIN = [
  {
    pergunta: "Preciso expor minha história ou falar na primeira sessão?",
    resposta:
      "De forma alguma. Cada participante tem seu próprio ritmo e tempo de abertura. Estar no grupo já é um ato de presença e transformação. Você só compartilha o que sentir no coração, sem qualquer pressão.",
  },
  {
    pergunta: "Como funcionam os grupos reduzidos?",
    resposta:
      "Nossos grupos contam com no máximo 15 participantes por encontro. Essa limitação garante que cada pessoa seja verdadeiramente ouvida, acolhida e acompanhada com cuidado individualizado e respeito ao seu processo.",
  },
  {
    pergunta: "Qual é a política de sigilo do INstituto Kalapa?",
    resposta:
      "O sigilo é nosso pilar ético inegociável. Tudo o que é compartilhado, vivenciado e revelado nos encontros permanece estritamente dentro do círculo do grupo, criando um solo seguro e confiável.",
  },
  {
    pergunta: "O que devo levar e como me preparar para o encontro?",
    resposta:
      "Venha com roupas confortáveis que permitam sentar e se movimentar com liberdade. Não é necessária nenhuma experiência prévia em terapias ou vivências. O espaço oferece todo o suporte para sua chegada.",
  },
  {
    pergunta: "Qual a frequência dos encontros?",
    resposta:
      "As vivências acontecem em ritmo quinzenal consciente. Esse intervalo é intencional: permite que os aprendizados e sentimentos acessados no grupo sejam integrados à sua rotina diária no seu próprio tempo.",
  },
];

/** Chips de duração predefinidos — constante de módulo para evitar recriação a cada render */
export const DURACAO_CHIPS = [
  { label: "45 min", value: "45" },
  { label: "1h (60 min)", value: "60" },
  { label: "1:30hs (90 min)", value: "90" },
  { label: "2h (120 min)", value: "120" },
  { label: "3h (180 min)", value: "180" },
] as const;

/** Formata duração em minutos para texto legível — ex: 90 → "1:30hs", 45 → "45min", 120 → "2h" */
export function formatDuracao(minutos: number | null | undefined): string {
  if (!minutos || minutos <= 0) return "1:30hs";
  if (minutos < 60) return `${minutos}min`;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return m > 0 ? `${h}:${m.toString().padStart(2, "0")}hs` : `${h}h`;
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatCPF(cpf?: string | null) {
  if (!cpf) return "—";
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  return cpf;
}
