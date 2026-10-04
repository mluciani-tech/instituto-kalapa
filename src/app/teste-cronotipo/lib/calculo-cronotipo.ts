import {
  QUESTOES_CRONOTIPO,
  CRONOTIPOS_MAP,
  TipoCronotipo,
  CronotipoInfo,
} from "../data/cronotipo-data";

export interface RespostaSelecionada {
  questaoId: number;
  dimensao: string;
  enunciado: string;
  opcaoLetra: "A" | "B" | "C";
  opcaoTexto: string;
  pontos: number;
}

export interface ResultadoCronotipoCalculado {
  pontuacaoTotal: number;
  pontuacaoMinima: number;
  pontuacaoMaxima: number;
  porcentagemEscala: number; // 0% a 100% relativo à amplitude (6 a 18)
  tipoCronotipo: TipoCronotipo;
  info: CronotipoInfo;
  respostasDetalhadas: RespostaSelecionada[];
}

/**
 * Calcula a pontuação e determina o cronotipo a partir das respostas.
 * respostas: Record<questaoId (1..6), letraOpcao ("A" | "B" | "C")>
 */
export function calcularResultadoCronotipo(
  respostas: Record<number, string>
): ResultadoCronotipoCalculado {
  let pontuacaoTotal = 0;
  const respostasDetalhadas: RespostaSelecionada[] = [];

  QUESTOES_CRONOTIPO.forEach((questao) => {
    const letra = (respostas[questao.id] || "B") as "A" | "B" | "C";
    const opcao = questao.opcoes.find((o) => o.letra === letra) || questao.opcoes[1];
    pontuacaoTotal += opcao.pontos;

    respostasDetalhadas.push({
      questaoId: questao.id,
      dimensao: questao.dimensao,
      enunciado: questao.enunciado,
      opcaoLetra: opcao.letra,
      opcaoTexto: opcao.texto,
      pontos: opcao.pontos,
    });
  });

  // Determinação do Cronotipo pelas faixas do gabarito oficial:
  // 15 a 18: Matutino (Cotovia)
  // 10 a 14: Intermediário (Urso)
  // 6 a 9: Vespertino (Coruja)
  let tipoCronotipo: TipoCronotipo = "intermediario";
  if (pontuacaoTotal >= 15) {
    tipoCronotipo = "matutino";
  } else if (pontuacaoTotal <= 9) {
    tipoCronotipo = "vespertino";
  } else {
    tipoCronotipo = "intermediario";
  }

  const pontuacaoMinima = 6;
  const pontuacaoMaxima = 18;
  const amplitude = pontuacaoMaxima - pontuacaoMinima; // 12
  const porcentagemEscala = Math.round(
    Math.max(0, Math.min(100, ((pontuacaoTotal - pontuacaoMinima) / amplitude) * 100))
  );

  return {
    pontuacaoTotal,
    pontuacaoMinima,
    pontuacaoMaxima,
    porcentagemEscala,
    tipoCronotipo,
    info: CRONOTIPOS_MAP[tipoCronotipo],
    respostasDetalhadas,
  };
}
