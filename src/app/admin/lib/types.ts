export type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

export type Tab =
  | "dashboard"
  | "sobre"
  | "produtos"
  | "pedidos"
  | "participantes"
  | "cupons"
  | "usuarios"
  | "agendamentos"
  | "avaliacoes"
  | "manual";
