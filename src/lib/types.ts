// Tipos compartilhados entre API e componentes

export interface Produto {
  id: string;
  slug: string;
  nome: string;
  descricao: string | null;
  descricao_curta: string | null;
  preco?: number | null;
  imagem_url: string | null;
  beneficios: string[];
  destaque?: boolean;
  ativo?: boolean;
  ordem?: number;
  vagas_maximas: number | null;
  categoria?: string | null;
  forma_pagamento_disponivel?: string | null;
  created_at?: string;
}

export interface VagasInfo {
  preenchidas: number;
  maximas: number;
  restantes: number;
  turma?: string;
}

export interface PedidoItem {
  produto_id: string;
  nome: string;
  quantidade: number;
  preco: number;
  imagem_url?: string | null;
}

export interface EnderecoEntrega {
  cep: string;
  rua: string;
  numero: string;
  complemento?: string | null;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface Pedido {
  id: string;
  order_nsu: string;
  produto_id?: string | null;
  usuario_id?: string | null;
  cliente_nome: string;
  cliente_email: string;
  cliente_telefone: string | null;
  cliente_cpf?: string | null;
  endereco_entrega?: EnderecoEntrega | null;
  itens?: PedidoItem[] | null;
  valor: number;
  valor_desconto?: number | null;
  cupom_id?: string | null;
  cupom_codigo?: string | null;
  status: string;
  metodo_pagamento: string | null;
  capture_method: string | null;
  receipt_url: string | null;
  transaction_nsu?: string | null;
  motivacao?: string | null;
  created_at: string;
  produtos?: { nome: string; slug: string } | null;
  inscricoes?: { nome: string | null; telefone: string | null; motivacao: string | null } | null;
  usuarios?: { nome: string; email: string; telefone: string; cpf: string } | null;
}

export interface Participante {
  id: string;
  turma_id: string;
  nome: string;
  email: string;
  telefone: string;
  motivacao: string | null;
  metodo_pagamento: string | null;
  valor: number;
  produto?: string;
  status: string;
  created_at: string;
  pedidos?: { cliente_nome: string | null; cliente_telefone: string | null; status: string | null; produtos?: { nome: string } | null } | null;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  uf: string;
  ativo: boolean;
  total_pedidos?: number;
  produtos_comprados?: { nome: string; quantidade: number }[];
  created_at: string;
  updated_at?: string;
}

export interface Cupom {
  id: string;
  codigo: string;
  tipo: "porcentagem" | "fixo";
  valor: number;
  quantidade_maxima: number | null;
  quantidade_utilizada: number;
  valor_minimo_pedido: number;
  validade: string | null;
  ativo: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ItemCarrinho {
  produto_id: string;
  slug: string;
  nome: string;
  preco: number;
  quantidade: number;
  imagem_url?: string | null;
  categoria?: string | null;
}
