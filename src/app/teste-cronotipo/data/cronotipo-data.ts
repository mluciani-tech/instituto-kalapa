export interface CronotipoOption {
  letra: "A" | "B" | "C";
  texto: string;
  pontos: number;
}

export interface CronotipoQuestion {
  id: number;
  dimensao: string;
  enunciado: string;
  opcoes: CronotipoOption[];
}

export type TipoCronotipo = "matutino" | "intermediario" | "vespertino";

export interface CronotipoInfo {
  chave: TipoCronotipo;
  nome: string;
  arquetipo: string;
  subtitulo: string;
  icone: string;
  corPrimaria: string;
  corSecundaria: string;
  corFundo: string;
  corBorda: string;
  faixaPontuacao: string;
  pontuacaoMin: number;
  pontuacaoMax: number;
  janelaPico: string;
  horarioSonoIdeal: string;
  resumo: string;
}

export const QUESTOES_CRONOTIPO: CronotipoQuestion[] = [
  {
    id: 1,
    dimensao: "Horário Espontâneo de Despertar",
    enunciado: "Em um dia sem obrigações ou despertador, a que horas você prefere acordar?",
    opcoes: [
      { letra: "A", texto: "Entre 05:00 e 07:00", pontos: 3 },
      { letra: "B", texto: "Entre 07:00 e 09:00", pontos: 2 },
      { letra: "C", texto: "Após as 09:00", pontos: 1 },
    ],
  },
  {
    id: 2,
    dimensao: "Disposição nos Primeiros 30 Minutos",
    enunciado: "Como você se sente nos primeiros 30 minutos após acordar pela manhã?",
    opcoes: [
      { letra: "A", texto: "Muito desperto e energizado", pontos: 3 },
      { letra: "B", texto: "Razoavelmente desperto, preciso de alguns minutos", pontos: 2 },
      { letra: "C", texto: "Muito sonolento, com grande dificuldade para me levantar", pontos: 1 },
    ],
  },
  {
    id: 3,
    dimensao: "Pico de Alerta Cognitivo e Rendimento",
    enunciado: "Em qual período do dia você sente que seu foco, raciocínio e produtividade atingem o nível máximo?",
    opcoes: [
      { letra: "A", texto: "Período da manhã / até por volta do meio-dia", pontos: 3 },
      { letra: "B", texto: "Meio da tarde", pontos: 2 },
      { letra: "C", texto: "Final da tarde ou durante a noite", pontos: 1 },
    ],
  },
  {
    id: 4,
    dimensao: "Horário Espontâneo para Deitar",
    enunciado: "Em dias de folga, em qual horário você costuma sentir sono e ir para a cama?",
    opcoes: [
      { letra: "A", texto: "Antes das 22:00", pontos: 3 },
      { letra: "B", texto: "Entre 22:00 e 23:30", pontos: 2 },
      { letra: "C", texto: "Após as 23:30", pontos: 1 },
    ],
  },
  {
    id: 5,
    dimensao: "Atividades Noturnas Exigentes",
    enunciado: "Se você precisasse realizar um teste difícil ou uma tarefa mentalmente cansativa entre 20h e 22h, como seria seu desempenho?",
    opcoes: [
      { letra: "A", texto: "Complicado, fico muito cansado nesse horário", pontos: 3 },
      { letra: "B", texto: "Razoável, consigo me adaptar sem grandes problemas", pontos: 2 },
      { letra: "C", texto: "Excelente, é um dos meus horários de maior energia", pontos: 1 },
    ],
  },
  {
    id: 6,
    dimensao: "Percepção Geral do Ritmo Biológico",
    enunciado: "Qual frase descreve melhor o seu funcionamento diário?",
    opcoes: [
      { letra: "A", texto: "Acordo cedo com facilidade e durmo cedo", pontos: 3 },
      { letra: "B", texto: "Tenho horários flexíveis e me adapto ao dia a dia", pontos: 2 },
      { letra: "C", texto: "Rendo muito mais à noite e prefiro dormir tarde", pontos: 1 },
    ],
  },
];

export const CRONOTIPOS_MAP: Record<TipoCronotipo, CronotipoInfo> = {
  matutino: {
    chave: "matutino",
    nome: "Cronotipo Matutino",
    arquetipo: "Cotovia",
    subtitulo: "O Ritmo do Amanhecer",
    icone: "Sunrise",
    corPrimaria: "#B8965A", // Dourado Kalapa
    corSecundaria: "#1A3C4D", // Petróleo Kalapa
    corFundo: "#FAF6EF",
    corBorda: "#E8DEC8",
    faixaPontuacao: "15 a 18 Pontos",
    pontuacaoMin: 15,
    pontuacaoMax: 18,
    janelaPico: "08:00 às 12:00",
    horarioSonoIdeal: "21:30 às 05:30 / 06:00",
    resumo:
      "Você tende a apresentar maior disposição física e mental nas primeiras horas do dia. Seu organismo costuma responder bem ao despertar precoce e sua energia diminui suavemente com o cair da noite.",
  },
  intermediario: {
    chave: "intermediario",
    nome: "Cronotipo Intermediário",
    arquetipo: "Urso",
    subtitulo: "O Ritmo da Adaptação",
    icone: "SunMedium",
    corPrimaria: "#7D8C6E", // Verde Sálvia Kalapa
    corSecundaria: "#1A3C4D", // Petróleo Kalapa
    corFundo: "#F6F8F4",
    corBorda: "#D4DECB",
    faixaPontuacao: "10 a 14 Pontos",
    pontuacaoMin: 10,
    pontuacaoMax: 14,
    janelaPico: "10:00 às 16:00",
    horarioSonoIdeal: "23:00 às 07:00",
    resumo:
      "Você tende a apresentar maior flexibilidade entre os extremos matutino e vespertino. Seu organismo transita com relativa facilidade entre diferentes horários, desde que mantida a regularidade de repouso.",
  },
  vespertino: {
    chave: "vespertino",
    nome: "Cronotipo Vespertino",
    arquetipo: "Coruja",
    subtitulo: "O Ritmo do Entardecer",
    icone: "Moon",
    corPrimaria: "#1A3C4D", // Petróleo Profundo Kalapa
    corSecundaria: "#B8965A", // Dourado Kalapa
    corFundo: "#F2F5F8",
    corBorda: "#C9D6DF",
    faixaPontuacao: "6 a 9 Pontos",
    pontuacaoMin: 6,
    pontuacaoMax: 9,
    janelaPico: "16:00 às 22:00",
    horarioSonoIdeal: "00:00 / 01:00 às 08:00 / 09:00",
    resumo:
      "Você tende a apresentar maior disposição, criatividade e estado de alerta em períodos mais tardios do dia. O início da manhã é um momento de transição e sua vitalidade atinge o ápice ao anoitecer.",
  },
};
