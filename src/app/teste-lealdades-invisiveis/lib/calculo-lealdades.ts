import { LEALDADES_PROFILES, LealdadeProfile } from "../data/lealdades-data";

export interface ResultadoLealdadesCalculado {
  perfilDominante: LealdadeProfile;
  pontuacoes: Record<string, number>;
  historico: Record<number, string>;
}

export function calcularResultadoLealdades(respostas: Record<number, string>): ResultadoLealdadesCalculado {
  const pontuacoes: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };

  // Contabiliza as respostas
  Object.values(respostas).forEach((letra) => {
    if (letra && pontuacoes[letra] !== undefined) {
      pontuacoes[letra] += 1;
    }
  });

  // Encontra a letra com maior pontuação
  let letraDominante = "A";
  let maiorPontuacao = -1;

  Object.entries(pontuacoes).forEach(([letra, pontos]) => {
    // Em caso de empate, o comportamento padrão será pegar a primeira letra que atingiu a pontuação.
    // Pode-se implementar lógicas customizadas se houver "dinâmica combinada", 
    // mas para o resultado principal retornamos o maior absoluto ou o primeiro em caso de empate.
    if (pontos > maiorPontuacao) {
      maiorPontuacao = pontos;
      letraDominante = letra;
    }
  });

  return {
    perfilDominante: LEALDADES_PROFILES[letraDominante],
    pontuacoes,
    historico: respostas,
  };
}
