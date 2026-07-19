# Instituto Kalapa — Landing Page

Landing page de conversão para o Instituto Kalapa com catálogo de serviços, contagem real de vagas via Supabase, pagamento via InfinitePay (API real), painel administrativo completo e checkout com design premium.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + Turbopack
- **Linguagem:** TypeScript
- **Estilos:** Tailwind CSS v4
- **Animações:** Framer Motion + ReactBits/Magic UI components
- **Banco:** Supabase (PostgreSQL + RLS)
- **Pagamento:** InfinitePay API (links dinâmicos)
- **E-mail:** Resend (com fallback mock)
- **Ícones:** Lucide React
- **Deploy:** Vercel

## Funcionalidades

- **Hero** com animação BlurText (blur→focus) e gradiente cinematográfico
- **Seção "A Experiência do Grupo"** com SplitText, GlareHover e ShinyText
- **Galeria visual** com BentoGrid e CardHoverEffect
- **Catálogo de produtos** com cards StarBorder (borda animada) e contador de vagas
- **Checkout premium** com cards glass-card-light, Pix/Cartão, parcelamento até 12x
- **Webhook de pagamento** com verificação HMAC por order (token único, não reutilizável)
- **Pós-pagamento** com confirmação e link para comprovante
- **Painel Admin** (`/admin`) com:
  - Login com HMAC-SHA256 (cookie httpOnly, 24h expiry)
  - CRUD de produtos (criar, editar, desativar, vagas por produto)
  - Upload de imagens para Supabase Storage (auth required)
  - Tabela de pedidos com busca, sort e paginação
  - Tabela de inscrições com busca, sort e paginação
  - Edição de dados de contato com sincronização pedido↔inscrição
  - Exclusão de pedidos pendentes
  - Opção de limpar banco de dados
- **Middleware** com proteção centralizada para rotas `/api/admin/*`
- **Security headers** (X-Frame-Options, HSTS, CSP, etc.)
- **Error boundaries** e loading states para todas as páginas
- **Notificação por e-mail** via Resend com formatação de moeda brasileira
- **Responsivo** — mobile-first, touch targets ≥44px, safe areas
- **Acessibilidade** — `aria-modal`, `role="dialog"`, Escape para fechar modais, `prefers-reduced-motion`, `focus-visible`

## Pré-requisitos

- Node.js 20+
- npm

## Setup

```bash
npm install
cp .env.example .env.local
# Editar .env.local com suas credenciais
npx next dev -p 3000
```

## Scripts

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Iniciar servidor de produção
npm run lint         # ESLint
npm run typecheck    # Verificação de tipos TypeScript
```

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Chave pública (anon) do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim | Chave secreta do servidor (service_role) — **sem prefixo NEXT_** |
| `ADMIN_PASSWORD` | Sim | Senha do painel administrativo `/admin` |
| `SESSION_SECRET` | Sim | Para assinar cookie de sessão e tokens HMAC de webhook |
| `WEBHOOK_SECRET` | Sim | Secret para verificação de origem do webhook InfinitePay |
| `INFINITEPAY_HANDLE` | Sim | Handle InfinitePay (sem @) para criar links de pagamento |
| `NEXT_PUBLIC_SITE_URL` | Sim | URL do site (para redirect e webhook da InfinitePay) |
| `RESEND_API_KEY` | Não | Chave da API Resend (mock se ausente) |
| `KALAPA_EMAIL_FROM` | Não | Remetente do e-mail de notificação |
| `KALAPA_EMAIL_TO` | Não | Destinatário do e-mail de notificação |

## Supabase

### Schema

Execute na ordem:
1. `supabase/schema.sql` — tabelas base (configuracoes + inscricoes)
2. `supabase/schema-v2.sql` — adiciona produtos, pedidos, vincula inscricoes
3. `supabase/migrate-vagas-per-produto.sql` — adiciona `vagas_maximas` por produto

### Estrutura das tabelas

- **configuracoes** — chave/valor (turma_atual, vagas_maximas)
- **produtos** — catálogo de serviços (nome, preço, vagas_maximas, destaque)
- **pedidos** — transações (order_nsu, produto_id, status, valor)
- **inscricoes** — participantes (turma_id, pedido_id, nome, email, status)

## Fluxo de Pagamento

1. Usuário escolhe produto → redirecionado para formulário de inscrição
2. Dados salvos no `sessionStorage` → redirecionado para checkout
3. Checkout cria pedido (`status: "pendente"`) + inscrição (`status: "pendente"`)
4. InfinitePay cria link de pagamento dinâmico
5. Usuário paga → Webhook com token HMAC confirma pagamento
6. Pedido e inscrição atualizados para `status: "pago"` → vaga ocupada
7. Página de sucesso mostra confirmação

## Deploy

Deploy automático via Vercel:

```bash
git add -A && git commit -m "mensagem" && git push origin main
```

## Links

- **Produção:** https://www.institutokalapa.com.br
- **Painel Admin:** https://www.institutokalapa.com.br/admin
- **GitHub:** https://github.com/mluciani-tech/instituto-kalapa

## Cores do Tema

| Cor | Hex | Uso |
|---|---|---|
| Brand Purple | `#1A3C4D` | Cor principal, headings |
| Brand Terracotta | `#B8965A` | CTAs, destaques, StarBorder |
| Brand Mint | `#7D8C6E` | Confirmação, sucesso |
| Brand Charcoal | `#4A4A4A` | Texto, fundo escuro |
| Brand Off-white | `#F8F4ED` | Fundo claro |
