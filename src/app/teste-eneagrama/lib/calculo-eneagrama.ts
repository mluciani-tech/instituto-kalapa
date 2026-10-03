import {
  AFIRMACOES_ENEAGRAMA,
  ENEAGRAMA_TIPOS_MAP,
  EneagramaTipo,
} from "../data/eneagrama-data";

export interface PontuacaoTipo {
  tipo: EneagramaTipo;
  letra: string;
  pontos: number;
  porcentagem: number; // 0 a 100%
}

export interface ResultadoEneagramaCalculado {
  totalRespondidas: number;
  totalQuestoes: number;
  pontuacoesPorLetra: Record<string, number>;
  ranking: PontuacaoTipo[];
  tipoDominante: EneagramaTipo;
  pontuacaoMaxima: number;
  empates: EneagramaTipo[];
  isEmpate: boolean;
}

export function calcularResultadoEneagrama(
  respostas: Record<string, number>
): ResultadoEneagramaCalculado {
  const totalQuestoes = AFIRMACOES_ENEAGRAMA.length;
  const letras: Array<"A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I"> = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
  ];

  const pontuacoesPorLetra: Record<string, number> = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
    H: 0,
    I: 0,
  };

  let totalRespondidas = 0;

  for (const afirmacao of AFIRMACOES_ENEAGRAMA) {
    const nota = respostas[afirmacao.id];
    if (typeof nota === "number") {
      totalRespondidas++;
      pontuacoesPorLetra[afirmacao.letra] += Math.max(0, Math.min(5, nota));
    }
  }

  // Gera o ranking com todos os 9 tipos
  const ranking: PontuacaoTipo[] = letras.map((letra) => {
    const tipo = ENEAGRAMA_TIPOS_MAP[letra];
    const pontos = pontuacoesPorLetra[letra] || 0;
    const porcentagem = Math.round((pontos / 25) * 100);
    return {
      tipo,
      letra,
      pontos,
      porcentagem,
    };
  });

  // Ordena por pontuação decrescente (maior para menor)
  ranking.sort((a, b) => b.pontos - a.pontos);

  const pontuacaoMaxima = ranking[0]?.pontos || 0;

  // Filtra todos os tipos que atingiram a pontuação máxima
  const empates = ranking
    .filter((item) => item.pontos === pontuacaoMaxima && pontuacaoMaxima > 0)
    .map((item) => item.tipo);

  const isEmpate = empates.length > 1;
  const tipoDominante = empates[0] || ranking[0].tipo;

  return {
    totalRespondidas,
    totalQuestoes,
    pontuacoesPorLetra,
    ranking,
    tipoDominante,
    pontuacaoMaxima,
    empates,
    isEmpate,
  };
}
