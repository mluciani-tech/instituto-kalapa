import type { Produto } from "./types";
import { isProdutoAgendamento, isProdutoCalendario } from "./agendamento";

export interface ProdutoBotoesConfig {
  textoPrincipal: string;
  textoSecundario: string;
  exibirSecundario: boolean;
  isDownloadGratuito: boolean;
  isAgendamento: boolean;
  isTeste: boolean;
  isCalendario: boolean;
}

/**
 * Resolve de forma inteligente os textos e visibilidade dos botões de ação do produto,
 * respeitando qualquer customização cadastrada no Admin (botao_principal_texto / botao_secundario_texto).
 */
export function getProdutoBotoesConfig(produto: Produto): ProdutoBotoesConfig {
  const preco = Number(produto.preco) || 0;
  const isGratuito = preco <= 0;
  const isAgendamento = isProdutoAgendamento(produto);
  const isCalendario = isProdutoCalendario(produto);
  const isTeste = Boolean(produto.is_teste);
  const isBiblioteca = Boolean(produto.is_biblioteca) || Boolean(produto.arquivo_url);
  const temArquivo = Boolean(produto.arquivo_url);

  // 1. Caso especial: Material Digital da Biblioteca Gratuito
  if (isBiblioteca && isGratuito && temArquivo) {
    const textoPrincipalPadrao = "Baixar Arquivo";
    return {
      textoPrincipal: produto.botao_principal_texto?.trim() || textoPrincipalPadrao,
      textoSecundario: produto.botao_secundario_texto?.trim() || "",
      exibirSecundario: Boolean(produto.botao_secundario_texto?.trim()),
      isDownloadGratuito: true,
      isAgendamento: false,
      isTeste: false,
      isCalendario: false,
    };
  }

  // 2. Caso especial: Atendimento Individual
  if (isAgendamento) {
    const textoPrincipalPadrao = "Ver Agenda & Horários";
    return {
      textoPrincipal: produto.botao_principal_texto?.trim() || textoPrincipalPadrao,
      textoSecundario: "",
      exibirSecundario: false,
      isDownloadGratuito: false,
      isAgendamento: true,
      isTeste: false,
      isCalendario: false,
    };
  }

  // 3. Caso especial: Calendário / Evento Informativo
  if (isCalendario || produto.permite_checkout === false) {
    const textoPrincipalPadrao = "Ver Detalhes do Evento";
    return {
      textoPrincipal: produto.botao_principal_texto?.trim() || textoPrincipalPadrao,
      textoSecundario: "",
      exibirSecundario: false,
      isDownloadGratuito: false,
      isAgendamento: false,
      isTeste: false,
      isCalendario: true,
    };
  }

  // 4. Caso especial: Teste de Autoconhecimento
  if (isTeste) {
    const textoPrincipalPadrao = isGratuito ? "Acessar Avaliação" : "Comprar Avaliação";
    const textoSecundarioPadrao = "Carrinho";
    return {
      textoPrincipal: produto.botao_principal_texto?.trim() || textoPrincipalPadrao,
      textoSecundario: produto.botao_secundario_texto?.trim() || textoSecundarioPadrao,
      exibirSecundario: !isGratuito || Boolean(produto.botao_secundario_texto?.trim()),
      isDownloadGratuito: false,
      isAgendamento: false,
      isTeste: true,
      isCalendario: false,
    };
  }

  // 5. Caso especial: Material Digital Pago (Biblioteca)
  if (isBiblioteca) {
    const textoPrincipalPadrao = "Comprar Material";
    const textoSecundarioPadrao = "Carrinho";
    return {
      textoPrincipal: produto.botao_principal_texto?.trim() || textoPrincipalPadrao,
      textoSecundario: produto.botao_secundario_texto?.trim() || textoSecundarioPadrao,
      exibirSecundario: true,
      isDownloadGratuito: false,
      isAgendamento: false,
      isTeste: false,
      isCalendario: false,
    };
  }

  // 6. Padrão: Vivências e Cursos em Grupo
  const textoPrincipalPadrao = isGratuito ? "Garantir Vaga Gratuitamente" : "Garantir Vaga";
  const textoSecundarioPadrao = "Reservar";
  return {
    textoPrincipal: produto.botao_principal_texto?.trim() || textoPrincipalPadrao,
    textoSecundario: produto.botao_secundario_texto?.trim() || textoSecundarioPadrao,
    exibirSecundario: !isGratuito || Boolean(produto.botao_secundario_texto?.trim()),
    isDownloadGratuito: false,
    isAgendamento: false,
    isTeste: false,
    isCalendario: false,
  };
}
