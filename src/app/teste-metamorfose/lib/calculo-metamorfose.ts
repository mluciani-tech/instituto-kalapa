import {
  CartaMetamorfose,
  obterCartaPorId,
  QUADRANTES_INFO,
} from "../data/metamorfose-data";

export type CategoriaTemaMetamorfose =
  | "projeto"
  | "carreira"
  | "relacionamento"
  | "decisao";

export interface AnotacaoQuadranteCaderno {
  resposta1?: string;
  resposta2?: string;
  resposta3?: string;
  ressonanciaCorporal?: string;
}

export interface EstadoJornadaMetamorfose {
  categoriaTema: CategoriaTemaMetamorfose;
  temaDescricao: string;
  temaEmSilencio: boolean;
  cartasSorteadas: {
    1?: string; // ex: "1.03"
    2?: string; // ex: "2.12"
    3?: string; // ex: "3.04"
    4?: string; // ex: "4.15"
  };
  caderno: {
    1?: AnotacaoQuadranteCaderno;
    2?: AnotacaoQuadranteCaderno;
    3?: AnotacaoQuadranteCaderno;
    4?: AnotacaoQuadranteCaderno;
  };
  sintesePessoal?: string;
}

export type TipoDiagnosticoBalanca =
  | "predominio_ferida"
  | "predominio_lucido"
  | "transicao_mista";

export interface DiagnosticoBalancaInfo {
  tipo: TipoDiagnosticoBalanca;
  totalBlocoA: number;
  totalBlocoB: number;
  titulo: string;
  subtitulo: string;
  analiseFenomenologica: string;
  perguntaChave: string;
  posturaRecomendada: string;
}

export interface ResultadoMetamorfoseCalculado {
  categoriaTema: CategoriaTemaMetamorfose;
  categoriaTemaLabel: string;
  temaDescricao: string;
  temaEmSilencio: boolean;
  cartas: {
    1: CartaMetamorfose;
    2: CartaMetamorfose;
    3: CartaMetamorfose;
    4: CartaMetamorfose;
  };
  caderno: {
    1: AnotacaoQuadranteCaderno;
    2: AnotacaoQuadranteCaderno;
    3: AnotacaoQuadranteCaderno;
    4: AnotacaoQuadranteCaderno;
  };
  equacaoNarrativa: {
    ovo: string;
    lagarta: string;
    crisalida: string;
    borboleta: string;
    textoContinuo: string;
  };
  balanca: DiagnosticoBalancaInfo;
}

export const CATEGORIAS_TEMA_LABELS: Record<CategoriaTemaMetamorfose, string> = {
  projeto: "Negócio, Empresa ou Projeto",
  carreira: "Carreira, Vocação ou Transição Profissional",
  relacionamento: "Relacionamento Afetivo ou Familiar",
  decisao: "Decisão Existencial Importante",
};

export const ESTADO_INICIAL_JORNADA: EstadoJornadaMetamorfose = {
  categoriaTema: "projeto",
  temaDescricao: "",
  temaEmSilencio: false,
  cartasSorteadas: {},
  caderno: {},
};

export function calcularResultadoMetamorfose(
  estado: EstadoJornadaMetamorfose
): ResultadoMetamorfoseCalculado | null {
  const c1 = estado.cartasSorteadas[1]
    ? obterCartaPorId(estado.cartasSorteadas[1])
    : undefined;
  const c2 = estado.cartasSorteadas[2]
    ? obterCartaPorId(estado.cartasSorteadas[2])
    : undefined;
  const c3 = estado.cartasSorteadas[3]
    ? obterCartaPorId(estado.cartasSorteadas[3])
    : undefined;
  const c4 = estado.cartasSorteadas[4]
    ? obterCartaPorId(estado.cartasSorteadas[4])
    : undefined;

  if (!c1 || !c2 || !c3 || !c4) {
    return null;
  }

  const listaCartas = [c1, c2, c3, c4];
  const totalBlocoA = listaCartas.filter((c) => c.bloco === "A").length;
  const totalBlocoB = listaCartas.filter((c) => c.bloco === "B").length;

  let balanca: DiagnosticoBalancaInfo;

  if (totalBlocoA >= 3) {
    balanca = {
      tipo: "predominio_ferida",
      totalBlocoA,
      totalBlocoB,
      titulo: "Predomínio do Bloco A — O Chamado da Reconciliação Ancestral",
      subtitulo: `${totalBlocoA} de 4 cartas em Ferida, Ego e Emaranhamento Transgeracional`,
      analiseFenomenologica:
        "O campo revela que o seu tema ou projeto ainda está sendo utilizado inconscientemente como um palco infantil para resgatar o passado familiar, compensar dores antigas, pagar dívidas morais ou buscar o olhar de quem veio antes. A fadiga ou os bloqueios que você sente não decorrem de incompetência técnica, mas do peso de tentar resolver no presente algo que pertence à história dos seus antepassados.",
      perguntaChave:
        "A quem na minha família sou secretamente leal quando mantenho essa dor ou esse padrão?",
      posturaRecomendada:
        "A atitude curativa neste momento não é forçar ações estratégicas imediatas nem brigar consigo mesmo, mas inclinar-se internamente diante da dor dos seus antepassados, dar um lugar no coração aos excluídos e concordar com o destino deles exatamente como foi.",
    };
  } else if (totalBlocoB >= 3) {
    balanca = {
      tipo: "predominio_lucido",
      totalBlocoA,
      totalBlocoB,
      titulo: "Predomínio do Bloco B — A Força da Consciência Adulta na Matéria",
      subtitulo: `${totalBlocoB} de 4 cartas em Consciência Adulta e Desafios Reais`,
      analiseFenomenologica:
        "A sua força realizadora já está assentada na realidade concreta e ancorada em um bom lugar sistêmico. O desconforto, o cansaço ou a tensão que você experimenta hoje não são 'bloqueios cármicos' nem emaranhamentos ocultos, mas o custo nobre e natural da maturidade: o atrito inevitável da matéria, a exigência de disciplina cotidiana, a proteção de limites, a formalização de acordos e a solidão de quem assume a própria autoria.",
      perguntaChave:
        "Qual é o próximo passo sóbrio, concreto e estruturado que a realidade dos fatos exige de mim hoje?",
      posturaRecomendada:
        "Renuncie a qualquer busca por explicações mágicas para os desafios normais do caminho. Respire fundo, honre a bagagem recebida dos seus pais e sustente a governança, o descanso do corpo e a firmeza ética nas trocas com o mundo.",
    };
  } else {
    balanca = {
      tipo: "transicao_mista",
      totalBlocoA,
      totalBlocoB,
      titulo: "Equilíbrio em Transição (2 e 2) — O Limiar entre o Solo e o Voo",
      subtitulo: "2 cartas no Bloco A (Emaranhamento) e 2 cartas no Bloco B (Consciência Adulta)",
      analiseFenomenologica:
        "A sua tiragem revela com nitidez cirúrgica o ponto exato da sua metamorfose: uma parte da sua energia já opera na maturidade adulta, servindo à vida com presença e competência (Bloco B), enquanto outra parte ainda é puxada de volta ao chão por lealdades invisíveis, receios infantis ou necessidade de aprovação da origem (Bloco A).",
      perguntaChave:
        "Onde a criança ferida ainda tenta puxar o meu projeto para o chão e onde o adulto em mim já sustenta o serviço à vida?",
      posturaRecomendada:
        "Observe em quais quadrantes específicos surgiram as cartas do Bloco A — ali reside a casca antiga que pede reverência e despedida. Apoie-se na lucidez dos quadrantes onde emergiu o Bloco B para conduzir essa travessia com serenidade e respeito aos seus limites.",
    };
  }

  return {
    categoriaTema: estado.categoriaTema || "projeto",
    categoriaTemaLabel:
      CATEGORIAS_TEMA_LABELS[estado.categoriaTema || "projeto"],
    temaDescricao: estado.temaDescricao || "",
    temaEmSilencio: Boolean(estado.temaEmSilencio),
    cartas: {
      1: c1,
      2: c2,
      3: c3,
      4: c4,
    },
    caderno: {
      1: estado.caderno[1] || {},
      2: estado.caderno[2] || {},
      3: estado.caderno[3] || {},
      4: estado.caderno[4] || {},
    },
    equacaoNarrativa: {
      ovo: c1.mensagem_completa,
      lagarta: c2.mensagem_completa,
      crisalida: c3.mensagem_completa,
      borboleta: c4.mensagem_completa,
      textoContinuo: `${c1.mensagem_completa} ${c2.mensagem_completa} ${c3.mensagem_completa} ${c4.mensagem_completa}`,
    },
    balanca,
  };
}

export function obterFalaConcordanciaCarta(carta: CartaMetamorfose): string {
  const qInfo = QUADRANTES_INFO[carta.quadrante_id];
  return carta.bloco === "A"
    ? qInfo.ritoDePassagem.falaConcordanciaBlocoA
    : qInfo.ritoDePassagem.falaConcordanciaBlocoB;
}
