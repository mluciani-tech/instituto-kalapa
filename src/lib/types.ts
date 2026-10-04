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
  vagas_ocupadas_manual?: number | null;
  categoria?: string | null;
  forma_pagamento_disponivel?: string | null;
  atendimento_individual?: boolean;
  duracao_minutos?: number | null;
  is_teste?: boolean;
  rota_teste?: string | null;
  orientacoes_pre_teste?: string | null;
  inclui_laudo_pdf?: boolean;
  created_at?: string;
}

export interface VagasInfo {
  preenchidas: number;
  maximas: number;
  restantes: number;
  turma?: string;
  manual?: boolean;
  reais?: number;
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

export interface BeneficiarioPedido {
  produto_id: string;
  produto_nome?: string;
  nome: string;
  email: string;
  telefone: string;
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
  beneficiarios?: BeneficiarioPedido[] | null;
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
  produtos?: { id?: string; nome: string; slug: string; ativo?: boolean } | null;
  inscricoes?: { nome: string | null; telefone: string | null; motivacao: string | null } | null;
  usuarios?: { nome: string; email: string; telefone: string; cpf: string } | null;
}

export interface Participante {
  id: string;
  turma_id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf?: string | null;
  motivacao: string | null;
  metodo_pagamento: string | null;
  valor: number;
  produto?: string;
  produto_id?: string | null;
  produto_ativo?: boolean;
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
  agendamento_id?: string | null;
  agendamento_inicio?: string | null;
  agendamento_fim?: string | null;
  terapeuta_nome?: string | null;
  is_teste?: boolean;
  rota_teste?: string | null;
}

export interface TesteCredito {
  id: string;
  pedido_id?: string | null;
  produto_id: string;
  usuario_id?: string | null;
  email_beneficiario: string;
  slug_teste: string;
  status: "disponivel" | "utilizado" | "expirado";
  avaliacao_id?: string | null;
  utilizado_em?: string | null;
  created_at: string;
  updated_at?: string;
  produtos?: Produto | null;
}

export interface Therapist {
  id: string;
  nome: string;
  titulo?: string | null;
  email?: string | null;
  telefone?: string | null;
  foto_url?: string | null;
  bio?: string | null;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TherapistAvailability {
  id: string;
  therapist_id: string;
  day_of_week: number; // 0 a 6 (0 = Domingo)
  start_time: string; // "09:00:00"
  end_time: string; // "12:00:00"
  slot_duration_minutes: number;
  buffer_duration_minutes: number;
  ativo: boolean;
  created_at?: string;
}

export interface TherapistBlock {
  id: string;
  therapist_id: string;
  start_time: string; // ISO 8601 UTC
  end_time: string; // ISO 8601 UTC
  reason?: string | null;
  created_at?: string;
}

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED";

export interface Appointment {
  id: string;
  therapist_id: string;
  patient_id?: string | null;
  produto_id?: string | null;
  pedido_id?: string | null;
  start_time: string; // ISO 8601 UTC
  end_time: string; // ISO 8601 UTC
  status: AppointmentStatus;
  expires_at?: string | null;
  notes?: string | null;
  cancellation_reason?: string | null;
  canceled_at?: string | null;
  canceled_by?: "patient" | "therapist" | "system" | null;
  created_at: string;
  updated_at?: string;
  therapists?: Therapist | null;
  produtos?: Produto | null;
  usuarios?: Usuario | null;
  pedidos?: Pedido | null;
}

export interface TimeSlot {
  startTime: string; // ISO 8601 UTC
  endTime: string; // ISO 8601 UTC
  timeDisplay: string; // "09:00"
  timeEndDisplay: string; // "09:50"
  available: boolean;
  reason?: string;
}

export interface AppointmentLog {
  id: string;
  appointment_id: string;
  action: string;
  actor_type: "patient" | "therapist" | "admin" | "system";
  actor_id?: string | null;
  details?: Record<string, unknown>;
  created_at: string;
}

export interface AvaliacaoYinYang {
  id: string;
  usuario_id?: string | null;
  nome: string;
  email: string;
  telefone?: string | null;
  tipo_resultado: "yang" | "yin";
  pontos_yang: number;
  pontos_yin: number;
  respostas: Record<number, "yang" | "yin">;
  created_at: string;
  updated_at?: string;
}

export interface AvaliacaoEneagrama {
  id: string;
  usuario_id?: string | null;
  nome: string;
  email: string;
  telefone?: string | null;
  /** Tipos (1-9) com a pontuação máxima; mais de um indica empate técnico */
  tipos_principais: number[];
  /** Pontuação por tipo, ex.: { "1": 18, ..., "9": 20 } */
  pontuacoes: Record<string, number>;
  respostas?: Record<string, number>;
  created_at: string;
  updated_at?: string;
}

