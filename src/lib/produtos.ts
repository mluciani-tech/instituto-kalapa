/**
 * Catálogo de produtos/serviços do INstituto Kalapa.
 *
 * Para adicionar um novo produto:
 * 1. Crie o link de pagamento no painel InfinitePay (conta: kalapa)
 * 2. Copie a URL gerada (ex: https://checkout.infinitepay.io/kalapa/XXXXXXXX)
 * 3. Adicione um novo objeto neste array seguindo o mesmo formato
 */

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  checkoutUrl: string;
  beneficios: string[];
  destaque?: boolean;
  ativo: boolean;
}

export const produtos: Produto[] = [
  {
    id: "grupo-autoconhecimento",
    nome: "Grupo de Autoconhecimento",
    descricao:
      "Um espaço seguro e acolhedor para explorar suas emoções, padrões e crenças em grupo. Encontros quinzenais facilitados por profissionais certificados.",
    // Preço gerenciado pelo painel Admin (variável preco_sessao no Supabase)
    // O valor 0 aqui é apenas um placeholder — o preço real sempre vem de /api/config
    preco: 0,
    checkoutUrl: "https://checkout.infinitepay.io/kalapa/hseV7BoYZT",
    beneficios: [
      "Acesso à sessão em grupo ao vivo",
      "Material de apoio pós-sessão",
      "Grupo de WhatsApp para suporte entre encontros",
      "Condições especiais para pacotes mensais",
    ],
    destaque: true,
    ativo: true,
  },
  // Próximos produtos serão adicionados aqui
  // Exemplo:
  // {
  //   id: "constelacao-familiar",
  //   nome: "Constelação Familiar",
  //   descricao: "...",
  //   preco: 0,
  //   checkoutUrl: "https://checkout.infinitepay.io/kalapa/XXXXXXXX",
  //   beneficios: ["..."],
  //   ativo: false,
  // },
];

/** Retorna apenas produtos ativos */
export const getProdutosAtivos = (): Produto[] =>
  produtos.filter((p) => p.ativo);

/** Busca produto pelo ID */
export const getProdutoById = (id: string): Produto | undefined =>
  produtos.find((p) => p.id === id);
