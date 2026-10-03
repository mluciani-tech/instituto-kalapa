export interface EneagramaStatement {
  id: string; // Ex: 'A1', 'B1'
  indiceGlobal: number; // 1 a 45
  letra: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I";
  numeroItem: number; // 1 a 5
  texto: string;
}

export interface EneagramaTipo {
  numero: number;
  letra: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I";
  nome: string;
  subtitulo: string;
  feridasEmocionais: string;
  mensagensInconscientes: string;
  medosFundamentais: string;
  desejosFundamentais: string;
  distorcoes: string;
  corBadge: string;
  corBorder: string;
  corBg: string;
  corText: string;
  arquetipo: string;
}

export const ESCALA_NOTAS = [
  { valor: 0, rotulo: "0", descricao: "Nada a ver comigo" },
  { valor: 1, rotulo: "1", descricao: "Quase nada a ver comigo" },
  { valor: 2, rotulo: "2", descricao: "Pouco a ver comigo" },
  { valor: 3, rotulo: "3", descricao: "Tem a ver comigo" },
  { valor: 4, rotulo: "4", descricao: "Muito a ver comigo" },
  { valor: 5, rotulo: "5", descricao: "Tudo a ver comigo" },
];

export const ENEAGRAMA_TIPOS_MAP: Record<string, EneagramaTipo> = {
  B: {
    numero: 1,
    letra: "B",
    nome: "Tipo 1 – O Perfeccionista / Reformador / Crítico",
    subtitulo: "O Perfeccionista / Reformador",
    arquetipo: "Integridade, ética, rigor e melhoria contínua",
    feridasEmocionais:
      "Sensação de ter sido julgado severamente na infância; ferida do erro e da imperfeição; medo de ser moralmente falho ou mau.",
    mensagensInconscientes:
      '"Não é correto cometer erros." / "Você precisa ser perfeito para ter valor."',
    medosFundamentais: "Medo de ser mau, corrupto, imperfeito, errado ou julgado.",
    desejosFundamentais: "Desejo de ser bom, ter integridade, ter razão e estar correto.",
    distorcoes: '"Você é bom, íntegro e justo exatamente como é."',
    corBadge: "bg-amber-100 text-amber-900 border-amber-300",
    corBorder: "border-amber-400",
    corBg: "bg-amber-50/60",
    corText: "text-amber-800",
  },
  C: {
    numero: 2,
    letra: "C",
    nome: "Tipo 2 – O Ajudador / Prestativo / Doador",
    subtitulo: "O Ajudador / Prestativo",
    arquetipo: "Empatia, generosidade, afeto e suporte aos outros",
    feridasEmocionais:
      "Sensação de que suas próprias necessidades não eram importantes; ferida da rejeição e do abandono afetivo.",
    mensagensInconscientes:
      '"Não é correto ter necessidades próprias ou expressá-las." / "Você só é amado se cuidar dos outros."',
    medosFundamentais: "Medo de não ser desejado, não ser amado ou ser dispensável.",
    desejosFundamentais: "Desejo de sentir-se amado, querido e apreciado.",
    distorcoes: '"Você é desejado e amado por quem você é, não pelo que faz pelos outros."',
    corBadge: "bg-rose-100 text-rose-900 border-rose-300",
    corBorder: "border-rose-400",
    corBg: "bg-rose-50/60",
    corText: "text-rose-800",
  },
  D: {
    numero: 3,
    letra: "D",
    nome: "Tipo 3 – O Realizador / Motivador / Bem-sucedido",
    subtitulo: "O Realizador / Bem-sucedido",
    arquetipo: "Eficiência, metas audaciosas, liderança e adaptabilidade",
    feridasEmocionais:
      "Ferida do valor condicionado; sensação de ter sido valorizado apenas pelas conquistas, desempenho e aparência de sucesso.",
    mensagensInconscientes:
      '"Não é correto ter sentimentos ou falhar." / "Você só vale o que realiza."',
    medosFundamentais: "Medo do fracasso, de não ter valor próprio ou de ser insignificante.",
    desejosFundamentais: "Desejo de sentir-se valioso, vitorioso e admirado.",
    distorcoes: '"Você é amado por quem você é, e não pelo seu desempenho ou sucesso."',
    corBadge: "bg-orange-100 text-orange-900 border-orange-300",
    corBorder: "border-orange-400",
    corBg: "bg-orange-50/60",
    corText: "text-orange-800",
  },
  E: {
    numero: 4,
    letra: "E",
    nome: "Tipo 4 – O Individualista / Romântico / Sensível",
    subtitulo: "O Individualista / Romântico",
    arquetipo: "Autenticidade, profundidade emocional, sensibilidade e expressão única",
    feridasEmocionais:
      "Ferida da desconexão e do abandono; sensação de que algo essencial lhe faltava em comparação aos outros.",
    mensagensInconscientes:
      '"Não é correto ser igual aos outros ou ser ordinário/comum."',
    medosFundamentais: "Medo de não ter identidade, de não ter significado pessoal ou de ser comum.",
    desejosFundamentais: "Desejo de ser autêntico, de encontrar a si mesmo e criar um significado único.",
    distorcoes: '"Você é visto, compreendido e valorizado na sua essência."',
    corBadge: "bg-purple-100 text-purple-900 border-purple-300",
    corBorder: "border-purple-400",
    corBg: "bg-purple-50/60",
    corText: "text-purple-800",
  },
  F: {
    numero: 5,
    letra: "F",
    nome: "Tipo 5 – O Observador / Investigador / Pensador",
    subtitulo: "O Observador / Investigador",
    arquetipo: "Sabedoria, observação profunda, clareza lógica e autonomia mental",
    feridasEmocionais:
      "Sensação de invasão do espaço pessoal e escassez de recursos emocionais; medo de ser sobrecarregado pelas demandas do mundo.",
    mensagensInconscientes:
      '"Não é correto ser afetivo demais ou ter muitas necessidades no mundo."',
    medosFundamentais: "Medo de ser incapaz, ignorante, impotente ou ter seu espaço/energia esgotados.",
    desejosFundamentais: "Desejo de ser competente, capaz e mestre em seu conhecimento.",
    distorcoes: '"Suas necessidades não são uma ameaça e o seu lugar no mundo é seguro."',
    corBadge: "bg-blue-100 text-blue-900 border-blue-300",
    corBorder: "border-blue-400",
    corBg: "bg-blue-50/60",
    corText: "text-blue-800",
  },
  G: {
    numero: 6,
    letra: "G",
    nome: "Tipo 6 – O Precavido / Leal / Cético",
    subtitulo: "O Precavido / Leal",
    arquetipo: "Lealdade, prudência, proteção coletiva e percepção aguçada de riscos",
    feridasEmocionais:
      "Ferida da desproteção e quebra de confiança nas autoridades ou no ambiente familiar; sensação de perigo iminente.",
    mensagensInconscientes:
      '"Não é correto confiar em si mesmo ou relaxar totalmente a guarda."',
    medosFundamentais: "Medo de ficar sem apoio, sem orientação, indefeso ou desamparado.",
    desejosFundamentais: "Desejo de ter segurança, certeza, apoio e proteção.",
    distorcoes: '"Você está seguro e pode confiar na sua própria orientação interior."',
    corBadge: "bg-slate-100 text-slate-900 border-slate-300",
    corBorder: "border-slate-400",
    corBg: "bg-slate-50/60",
    corText: "text-slate-800",
  },
  H: {
    numero: 7,
    letra: "H",
    nome: "Tipo 7 – O Entusiasta / Epicurista / Sonhador",
    subtitulo: "O Entusiasta / Epicurista",
    arquetipo: "Alegria de viver, criatividade, versatilidade e busca de novas possibilidades",
    feridasEmocionais:
      "Ferida da privação e do sofrimento prematuro; sensação de ter sido privado de nutrição emocional ou conforto.",
    mensagensInconscientes:
      '"Não é correto depender dos outros nem entrar em contato com a dor/tristeza."',
    medosFundamentais: "Medo de ficar preso à dor, de sofrer privações, de ser limitado ou entediado.",
    desejosFundamentais: "Desejo de ser feliz, satisfeito, livre e experimentar tudo de bom que a vida oferece.",
    distorcoes: '"Suas necessidades serão plenamente atendidas e você pode ser feliz no presente."',
    corBadge: "bg-yellow-100 text-yellow-900 border-yellow-300",
    corBorder: "border-yellow-400",
    corBg: "bg-yellow-50/60",
    corText: "text-yellow-800",
  },
  I: {
    numero: 8,
    letra: "I",
    nome: "Tipo 8 – O Confrontador / Desafiador / Líder",
    subtitulo: "O Confrontador / Desafiador",
    arquetipo: "Força, assertividade, defesa dos vulneráveis e firmeza inabalável",
    feridasEmocionais:
      "Ferida do controle e da traição; sensação de ter sido vulnerável em um ambiente injusto e ter precisado se armar.",
    mensagensInconscientes:
      '"Não é correto ser vulnerável ou confiar plenamente em ninguém."',
    medosFundamentais: "Medo de ser controlado, dominado, vulnerável ou prejudicado pelos outros.",
    desejosFundamentais: "Desejo de proteger a si mesmo, ter controle do próprio destino e ser forte.",
    distorcoes: '"Você não será traído nem machucado; é seguro abrir seu coração."',
    corBadge: "bg-red-100 text-red-900 border-red-300",
    corBorder: "border-red-400",
    corBg: "bg-red-50/60",
    corText: "text-red-800",
  },
  A: {
    numero: 9,
    letra: "A",
    nome: "Tipo 9 – O Pacífico / Mediador / Preservador",
    subtitulo: "O Pacífico / Mediador",
    arquetipo: "Harmonia, mediação de conflitos, serenidade e aceitação incondicional",
    feridasEmocionais:
      "Ferida da invisibilidade e da anulação; sensação de que sua presença ou opinião não faziam diferença para a família.",
    mensagensInconscientes:
      '"Não é correto se impor, fazer barulho ou gerar conflitos."',
    medosFundamentais: "Medo do conflito, da separação, do desconforto e da perda de conexão.",
    desejosFundamentais: "Desejo de paz interior, estabilidade, harmonia e união.",
    distorcoes: '"A sua presença importa e a sua voz faz diferença no mundo."',
    corBadge: "bg-emerald-100 text-emerald-900 border-emerald-300",
    corBorder: "border-emerald-400",
    corBg: "bg-emerald-50/60",
    corText: "text-emerald-800",
  },
};

export const AFIRMACOES_ENEAGRAMA: EneagramaStatement[] = [
  // Ciclo 1: 1 a 9
  {
    id: "A1",
    indiceGlobal: 1,
    letra: "A",
    numeroItem: 1,
    texto:
      "Você é considerado uma pessoa pacífica, que se dá bem com quase todo mundo. É fácil ouvir as pessoas e ser simpático. Gosta de bater papo e ser amigável com todos.",
  },
  {
    id: "B1",
    indiceGlobal: 2,
    letra: "B",
    numeroItem: 1,
    texto:
      "Você é considerado crítico com os outros e consigo. Não gosta de ser criticado.",
  },
  {
    id: "C1",
    indiceGlobal: 3,
    letra: "C",
    numeroItem: 1,
    texto:
      "Você gosta muito de ajudar as pessoas, em especial as mais queridas. Desdobra-se para auxiliá-las, elogiá-las e falar bem delas.",
  },
  {
    id: "D1",
    indiceGlobal: 4,
    letra: "D",
    numeroItem: 1,
    texto:
      "Você considera importante entrar em um jogo para vencer. Tem foco grande em resultados e busca reconhecimento pelas suas realizações.",
  },
  {
    id: "E1",
    indiceGlobal: 5,
    letra: "E",
    numeroItem: 1,
    texto:
      "O trabalho e as coisas que faz precisam ter um significado maior do que sobrevivência. Não gosta de rotinas genéricas e precisa se sentir valorizado como um ser único.",
  },
  {
    id: "F1",
    indiceGlobal: 6,
    letra: "F",
    numeroItem: 1,
    texto:
      "Você é muito racional e analítico. Acredita que decisões devem ser tomadas com lógica e inteligência, evitando emocionalismos.",
  },
  {
    id: "G1",
    indiceGlobal: 7,
    letra: "G",
    numeroItem: 1,
    texto:
      "Você é precavido e pensa nas coisas antes que aconteçam. Planeja-se com antecedência para evitar imprevistos e riscos.",
  },
  {
    id: "H1",
    indiceGlobal: 8,
    letra: "H",
    numeroItem: 1,
    texto:
      "Você adora novidades, aventuras e novas experiências. Seu pensamento é aberto para novas tendências e prefere aprender coisas inovadoras.",
  },
  {
    id: "I1",
    indiceGlobal: 9,
    letra: "I",
    numeroItem: 1,
    texto:
      "Você é muito direto e objetivo. Vai direto ao ponto. Sua firmeza pode ser vista como agressividade, mas você considera isso melindre dos outros.",
  },

  // Ciclo 2: 10 a 18
  {
    id: "A2",
    indiceGlobal: 10,
    letra: "A",
    numeroItem: 2,
    texto:
      "Prefere tomar decisões por consenso, ouvindo a todos. Negociar e mediar são habilidades naturais. Não gosta de decisões autoritárias.",
  },
  {
    id: "B2",
    indiceGlobal: 11,
    letra: "B",
    numeroItem: 2,
    texto:
      "Gosta de coisas ordenadas nos devidos lugares. A desordem o irrita, especialmente se mexerem no que você arrumou.",
  },
  {
    id: "C2",
    indiceGlobal: 12,
    letra: "C",
    numeroItem: 2,
    texto:
      "Cuida tanto dos outros que acaba se esquecendo de cuidar de si mesmo. É mais fácil reconhecer e atender às necessidades alheias do que às suas.",
  },
  {
    id: "D2",
    indiceGlobal: 13,
    letra: "D",
    numeroItem: 2,
    texto:
      "Impressiona pela capacidade de se superar e atingir metas audaciosas de forma rápida.",
  },
  {
    id: "E2",
    indiceGlobal: 14,
    letra: "E",
    numeroItem: 2,
    texto:
      "Seu humor varia com facilidade. Pode estar contente e, no minuto seguinte, descontente, às vezes sem saber o porquê.",
  },
  {
    id: "F2",
    indiceGlobal: 15,
    letra: "F",
    numeroItem: 2,
    texto:
      "Aprecia ficar sozinho para pensar e recarregar as energias. Sente-se muito bem em momentos de introspecção.",
  },
  {
    id: "G2",
    indiceGlobal: 16,
    letra: "G",
    numeroItem: 2,
    texto:
      "É cético e precisa de comprovações (\"ver para crer\"). Identifica rapidamente riscos e possíveis falhas em projetos otimistas demais.",
  },
  {
    id: "H2",
    indiceGlobal: 17,
    letra: "H",
    numeroItem: 2,
    texto:
      "Busca prazer, lazer e diversão. Se algo perde o prazer, tende a procrastinar ou abandonar para começar algo novo.",
  },
  {
    id: "I2",
    indiceGlobal: 18,
    letra: "I",
    numeroItem: 2,
    texto:
      "Não tolera injustiças ou abuso de poder sobre os mais fracos. Assume brigas para defendê-los e é visto como uma pessoa forte e comandante.",
  },

  // Ciclo 3: 19 a 27
  {
    id: "A3",
    indiceGlobal: 19,
    letra: "A",
    numeroItem: 3,
    texto:
      "Distrai-se facilmente com prioridades dos outros. Tem dificuldade em dizer \"não\" a pedidos de ajuda, deixando suas tarefas para trás.",
  },
  {
    id: "B3",
    indiceGlobal: 20,
    letra: "B",
    numeroItem: 3,
    texto:
      "Não tolera erros (seus e dos outros) e se culpa bastante quando comete uma falha.",
  },
  {
    id: "C3",
    indiceGlobal: 21,
    letra: "C",
    numeroItem: 3,
    texto:
      "É muito difícil dizer \"não\" para quem precisa de você, por receio de magoar a pessoa ou parecer egoísta.",
  },
  {
    id: "D3",
    indiceGlobal: 22,
    letra: "D",
    numeroItem: 3,
    texto:
      "Valoriza a imagem de sucesso. Fala bem de suas qualidades e evita expor fraquezas ou fracassos.",
  },
  {
    id: "E3",
    indiceGlobal: 23,
    letra: "E",
    numeroItem: 3,
    texto:
      "Não gosta de ser igual a todo mundo; busca ser diferente e especial. Atrai a atenção por sua originalidade.",
  },
  {
    id: "F3",
    indiceGlobal: 24,
    letra: "F",
    numeroItem: 3,
    texto:
      "Valoriza o conhecimento, a ciência e a informação. Busca aprender constantemente e admira pessoas inteligentes.",
  },
  {
    id: "G3",
    indiceGlobal: 25,
    letra: "G",
    numeroItem: 3,
    texto:
      "Leva tempo para confiar nas pessoas e prefere manter a prudência até ter certeza das intenções delas.",
  },
  {
    id: "H3",
    indiceGlobal: 26,
    letra: "H",
    numeroItem: 3,
    texto:
      "Faz muitas coisas ao mesmo tempo. Tem dificuldade em focar em uma única tarefa do início ao fim sem intercalar outros assuntos.",
  },
  {
    id: "I3",
    indiceGlobal: 27,
    letra: "I",
    numeroItem: 3,
    texto:
      "Causa impacto natural por onde passa. Seu tom de voz é forte e assertivo, mesmo quando não percebe.",
  },

  // Ciclo 4: 28 a 36
  {
    id: "A4",
    indiceGlobal: 28,
    letra: "A",
    numeroItem: 4,
    texto:
      "Valoriza o trabalho em equipe e a vitória coletiva. Desconforta-se quando tentam colocá-lo em destaque individual.",
  },
  {
    id: "B4",
    indiceGlobal: 29,
    letra: "B",
    numeroItem: 4,
    texto:
      "Exige perfeição em tudo o que faz. Para você, ou o trabalho é feito nos mínimos detalhes com excelência, ou não serve.",
  },
  {
    id: "C4",
    indiceGlobal: 30,
    letra: "C",
    numeroItem: 4,
    texto:
      "Espera que os outros adivinhem quando você precisa de carinho ou atenção, achando difícil pedir isso abertamente.",
  },
  {
    id: "D4",
    indiceGlobal: 31,
    letra: "D",
    numeroItem: 4,
    texto:
      "Adapta-se facilmente a diferentes contextos e públicos para manter uma imagem positiva e alcançar seus objetivos.",
  },
  {
    id: "E4",
    indiceGlobal: 32,
    letra: "E",
    numeroItem: 4,
    texto:
      "É bastante emocional e reflexivo. Quando sente emoções intensas, costuma se recolher em seu próprio mundo.",
  },
  {
    id: "F4",
    indiceGlobal: 33,
    letra: "F",
    numeroItem: 4,
    texto:
      "Preserva muito seu espaço pessoal e detesta invasões físicas ou conversas fúteis sem intimidade.",
  },
  {
    id: "G4",
    indiceGlobal: 34,
    letra: "G",
    numeroItem: 4,
    texto:
      "Ansioso por antecipar perigos. Preocupa-se constantemente com o que pode dar errado (\"e se...?\").",
  },
  {
    id: "H4",
    indiceGlobal: 35,
    letra: "H",
    numeroItem: 4,
    texto:
      "Extremamente otimista, foca no lado positivo de tudo. Desconforta-se com pessimismo e busca reanimar as pessoas.",
  },
  {
    id: "I4",
    indiceGlobal: 36,
    letra: "I",
    numeroItem: 4,
    texto:
      "Impulsivo para a ação. Prefere fazer rapidamente a ficar apenas analisando, podendo agir como um \"trator\" na pressa.",
  },

  // Ciclo 5: 37 a 45
  {
    id: "A5",
    indiceGlobal: 37,
    letra: "A",
    numeroItem: 5,
    texto:
      "Abre mão de vontades próprias em prol da harmonia e para evitar conflitos com o grupo.",
  },
  {
    id: "B5",
    indiceGlobal: 38,
    letra: "B",
    numeroItem: 5,
    texto:
      "Irrita-se com irresponsabilidade e falta de compromisso. Leva palavra e prazos muito a sério.",
  },
  {
    id: "C5",
    indiceGlobal: 39,
    letra: "C",
    numeroItem: 5,
    texto:
      "Afetuoso e atencioso, constrói vínculos profundos e atua frequentemente como conselheiro e confidente.",
  },
  {
    id: "D5",
    indiceGlobal: 40,
    letra: "D",
    numeroItem: 5,
    texto:
      "Apressado e impaciente com pessoas lentas que possam comprometer resultados e metas.",
  },
  {
    id: "E5",
    indiceGlobal: 41,
    letra: "E",
    numeroItem: 5,
    texto:
      "Idealiza situações (viagens, relacionamentos) e, ao realizá-las, pode sentir decepção ou perda do interesse.",
  },
  {
    id: "F5",
    indiceGlobal: 42,
    letra: "F",
    numeroItem: 5,
    texto:
      "Gosta de resolver quebra-cabeças e entender a lógica por trás do funcionamento das coisas. Prefere resolver sozinho.",
  },
  {
    id: "G5",
    indiceGlobal: 43,
    letra: "G",
    numeroItem: 5,
    texto:
      "Tende a duvidar de sua própria capacidade e busca validação ou orientação de autoridades para ter certeza do caminho.",
  },
  {
    id: "H5",
    indiceGlobal: 44,
    letra: "H",
    numeroItem: 5,
    texto:
      "Preza imensamente pela liberdade. Odeia se sentir amarrado a compromissos rígidos de longo prazo.",
  },
  {
    id: "I5",
    indiceGlobal: 45,
    letra: "I",
    numeroItem: 5,
    texto:
      "Extremamente franco e direto. Fala a verdade não importa a quem doer, sem buscar agradar.",
  },
];
