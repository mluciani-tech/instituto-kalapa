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

export interface Pedido {
  id: string;
  order_nsu: string;
  produto_id?: string | null;
  cliente_nome: string;
  cliente_email: string;
  cliente_telefone: string | null;
  valor: number;
  status: string;
  metodo_pagamento: string | null;
  capture_method: string | null;
  receipt_url: string | null;
  transaction_nsu?: string | null;
  created_at: string;
  produtos?: { nome: string; slug: string } | null;
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
  status: string;
  created_at: string;
}
