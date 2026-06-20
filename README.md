# Instituto Kalapa — Landing Page

Landing page de conversão para o Instituto Kalapa com venda de ingressos para sessões terapêuticas em grupo quinzenais (presenciais), contagem real de vagas via Supabase, pagamento via InfinitePay (API real), preço dinâmico configurável via admin e painel administrativo completo.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + Turbopack
- **Linguagem:** TypeScript
- **Estilos:** Tailwind CSS v4
- **Animações:** Framer Motion
- **Formulários:** react-hook-form + Zod
- **Banco:** Supabase (PostgreSQL + RLS)
- **Pagamento:** InfinitePay API (links dinâmicos)
- **E-mail:** Resend (com fallback mock)
- **Ícones:** Lucide React
- **Deploy:** Vercel

## Funcionalidades

- **Hero cinematográfico** com gradiente, overlay e imagem de fundo
- **Seção "A Experiência do Grupo"** com benefícios da terapia em grupo
- **Galeria visual** com imagens cinematográficas do Unsplash
- **Formulário de inscrição** com validação Zod, máscara de telefone e contador de vagas em tempo real
- **Preço dinâmico** configurável no admin, atualiza em tempo real na landing page, checkout e pós-pagamento
- **Checkout com InfinitePay** via API (Pix/Cartão), parcelamento até 12x
- **Webhook de pagamento** com filtro por `order_nsu` (atualiza apenas a inscrição correta)
- **Pós-pagamento** com preço dinâmico e link para comprovante
- **Painel Admin** (`/admin`) com:
  - Login com HMAC-SHA256 (cookie httpOnly, 24h expiry)
  - Edição de preço da sessão (com suporte a centavos: R$ 40,50)
  - Edição de vagas máximas por turma
  - Listagem de participantes (cards mobile + tabela desktop)
  - Opção de limpar banco de dados
- **Notificação por e-mail** via Resend com formatação de moeda brasileira
- **Responsivo** — mobile-first, touch targets ≥44px, safe areas, viewport-fit
- **Acessibilidade** — `autocomplete`, `aria-live`, `role`, `prefers-reduced-motion`, `inputmode`

## Pré-requisitos

- Node.js 20+
- npm

## Setup

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env.local

# Editar .env.local com suas credenciais

# Iniciar servidor de desenvolvimento
npx next dev -p 3000
```

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Chave pública (anon) do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim | Chave secreta do servidor (service_role) — **sem prefixo NEXT_** |
| `ADMIN_PASSWORD` | Sim | Senha do painel administrativo `/admin` |
| `SESSION_SECRET` | Não | Para assinar cookie de sessão (fallback = ADMIN_PASSWORD) |
| `INFINITEPAY_HANDLE` | Sim | Handle InfinitePay (sem @) para criar links de pagamento |
| `NEXT_PUBLIC_SITE_URL` | Sim | URL do site (para redirect e webhook da InfinitePay) |
| `RESEND_API_KEY` | Não | Chave da API Resend (mock se ausente) |
| `KALAPA_EMAIL_FROM` | Não | Remetente do e-mail de notificação |
| `KALAPA_EMAIL_TO` | Não | Destinatário do e-mail de notificação |

> **Importante:** No Vercel, a variável `SUPABASE_SERVICE_ROLE_KEY` deve estar marcada como **Production** (não apenas Preview).

## Supabase

### Schema

Execute o conteúdo de `supabase/schema.sql` no SQL Editor do Supabase. O script é idempotente (pode ser executado várias vezes com segurança).

### RLS

- `SELECT`: público (para o contador de vagas funcionar)
- `INSERT/UPDATE/DELETE`: apenas via `service_role` (server-side)
- A chave anon (pública) só pode **ler** dados

### Estrutura das tabelas

```sql
-- Configurações do site (preço, vagas, turma)
CREATE TABLE configuracoes (
  chave TEXT PRIMARY KEY,
  valor TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inscrições
CREATE TABLE inscricoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  turma_id TEXT NOT NULL DEFAULT '2025-01',
  order_nsu TEXT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  motivacao TEXT,
  metodo_pagamento TEXT,
  valor NUMERIC(10,2) DEFAULT 97,
  status TEXT NOT NULL DEFAULT 'confirmada',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Configurações padrão

| Chave | Valor | Descrição |
|---|---|---|
| `preco_sessao` | `97` | Preço em reais (suporta centavos) |
| `vagas_maximas` | `15` | Limite de vagas por turma |
| `turma_atual` | `2025-01` | ID da turma ativa |

## Fluxo de Pagamento

1. Usuário preenche formulário → dados salvos no `sessionStorage`
2. Redirecionado para checkout → escolhe Pix ou Cartão
3. Checkout cria inscrição (`status: "confirmada"`) + envia e-mail
4. InfinitePay cria link de pagamento dinâmico
5. Usuário paga no InfinitePay
6. Webhook recebe confirmação → atualiza inscrição (`status: "pago"`)
7. Pós-pagamento mostra confirmação com preço dinâmico

## Deploy

O projeto está configurado para deploy automático no Vercel via GitHub:

```bash
git add -A && git commit -m "mensagem" && git push origin main
```

O Vercel detecta o push e faz deploy automático.

### Variáveis no Vercel

Todas as variáveis devem ser configuradas no **Settings → Environment Variables** do Vercel, marcadas para **Production**.

## Links

- **Produção:** https://instituto-kalapa.vercel.app
- **Painel Admin:** https://instituto-kalapa.vercel.app/admin
- **GitHub:** https://github.com/mluciani-tech/instituto-kalapa

## Estrutura do Projeto

```
src/
├── app/
│   ├── admin/page.tsx                  # Painel administrativo
│   ├── api/
│   │   ├── admin/
│   │   │   ├── limpar/route.ts         # DELETE — limpa registros
│   │   │   ├── login/route.ts          # POST — login admin
│   │   │   ├── logout/route.ts         # POST — logout admin
│   │   │   ├── participantes/route.ts  # GET — lista participantes
│   │   │   └── verify/route.ts         # GET — verifica sessão
│   │   ├── checkout/route.ts           # POST — cria link InfinitePay
│   │   ├── config/route.ts             # GET/PUT — configurações dinâmicas
│   │   ├── send-email/route.ts         # POST — salva inscrição + envia e-mail
│   │   ├── vagas/route.ts              # GET — contagem de vagas
│   │   └── webhook/route.ts            # POST — confirmação pagamento InfinitePay
│   ├── checkout/
│   │   ├── page.tsx                    # Página de checkout
│   │   └── sucesso/page.tsx            # Pós-pagamento
│   ├── components/
│   │   ├── Checkout.tsx                # Componente de pagamento
│   │   ├── Footer.tsx                  # Rodapé
│   │   ├── GroupExperience.tsx         # Benefícios do grupo
│   │   ├── Hero.tsx                    # Seção de abertura
│   │   ├── RegistrationForm.tsx        # Formulário + contador vagas
│   │   └── VisualGallery.tsx           # Galeria de imagens
│   ├── globals.css                     # Tema e estilos globais
│   ├── layout.tsx                      # Layout raiz
│   └── page.tsx                        # Landing page
├── lib/
│   ├── auth.ts                         # Autenticação HMAC admin
│   └── supabase.ts                     # Clientes Supabase
├── supabase/
│   └── schema.sql                      # Schema completo do banco
├── .env.example                        # Template de variáveis
└── .env.local                          # Credenciais (não commitado)
```

## Cores do Tema

| Cor | Hex | Uso |
|---|---|---|
| Roxo | `#673de6` | Cor principal, botões, links |
| Terracota | `#CC6223` | CTA, destaques, urgência |
| Bege | `#F3E5D6` | Fundo claro |
| Verde Menta | `#7EC8A0` | Confirmação, sucesso |
| Charcoal | `#282D30` | Fundo escuro, texto |
