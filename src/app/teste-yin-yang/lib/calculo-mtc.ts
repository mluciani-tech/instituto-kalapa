export function calcularPontuacaoYinYang(respostas: Record<number, "yang" | "yin">) {
  const totalRespondidas = Object.keys(respostas).length;
  const pontosYang = Object.values(respostas).filter((r) => r === "yang").length;
  const pontosYin = Object.values(respostas).filter((r) => r === "yin").length;

  let tipoResultado: "yang" | "yin" = "yang";
  if (pontosYang > pontosYin) {
    tipoResultado = "yang";
  } else if (pontosYin > pontosYang) {
    tipoResultado = "yin";
  }

  return {
    totalRespondidas,
    pontosYang,
    pontosYin,
    tipoResultado,
  };
}
