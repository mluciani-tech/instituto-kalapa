# Instituto Kalapa — Landing Page

Landing page de conversão para o Instituto Kalapa com venda de ingressos para sessões terapêuticas em grupo quinzenais (presenciais), contagem real de vagas via Supabase, pagamento via InfinitePay (simulado) e painel administrativo.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + Turbopack
- **Linguagem:** TypeScript
- **Estilos:** Tailwind CSS v4
- **Animações:** Framer Motion
- **Formulários:** react-hook-form + Zod
- **Banco:** Supabase (PostgreSQL + RLS)
- **E-mail:** Resend (com fallback mock)
- **Ícones:** Lucide React
- **Ímplantação:** Vercel

## Funcionalidades

- **Hero cinematográfico** com gradiente, overlay e imagem de fundo
- **Seção "A Experiência do Grupo"** com benefícios da terapia em grupo
- **Galeria visual** com 3 imagens cinematográficas do Unsplash
- **Formulário de inscrição** com validação, máscara de telefone e contador de vagas em tempo real (15 vagas máx.)
- **Checkout** simulado com Pix/Cartão, parcelamento e confirmação
- **Painel Admin** (`/admin`) com login protegido, listagem de participantes e opção de limpar banco de dados
- **Notificação por e-mail** via Resend (funciona em modo mock sem API key)
- **Responsivo** — adaptado para smartphones, tablets e desktop
- **Acessibilidade** — `autocomplete`, `aria-live`, `role`, `prefers-reduced-motion`

## Pré-requisitos

- Node.js 20+
- npm

## Setup

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env.local

# Iniciar servidor de desenvolvimento
npx next dev -p 3000
```

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Chave pública (anon) do Supabase |
| `NEXT_SUPABASE_SERVICE_ROLE_KEY` | Sim | Chave secreta do servidor (service_role) |
| `ADMIN_PASSWORD` | Sim | Senha do painel administrativo `/admin` |
| `SESSION_SECRET` | Não | Para assinar cookie de sessão (fallback = ADMIN_PASSWORD) |
| `RESEND_API_KEY` | Não | Chave da API Resend (mock se ausente) |
| `KALAPA_EMAIL_FROM` | Não | Remetente do e-mail de notificação |
| `KALAPA_EMAIL_TO` | Não | Destinatário do e-mail de notificação |

## Supabase

### Schema

Execute o conteúdo de `supabase/schema.sql` no SQL Editor do Supabase.

### RLS

- `SELECT`: público (para o contador de vagas funcionar)
- `INSERT/UPDATE/DELETE`: apenas via `service_role` (server-side)
- A chave anon (pública) só pode **ler** dados

### Estrutura da tabela

```sql
CREATE TABLE inscricoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  turma_id TEXT NOT NULL DEFAULT '2025-01',
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  motivacao TEXT,
  metodo_pagamento TEXT,
  valor INTEGER DEFAULT 97,
  status TEXT NOT NULL DEFAULT 'confirmada',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Deploy

O projeto está configurado para deploy no Vercel:

```bash
npm install -g vercel
vercel --prod
```

Ou conecte o repositório GitHub diretamente no [Vercel Dashboard](https://vercel.com).

### Variáveis no Vercel

Todas as variáveis do `.env.local` (exceto as que começam com `NEXT_PUBLIC_`) devem ser configuradas como **Environment Variables** no Vercel. As `NEXT_PUBLIC_*` podem ser passadas como build env.

## Links

- **Produção:** https://instituto-kalapa.vercel.app
- **Painel Admin:** https://instituto-kalapa.vercel.app/admin
- **GitHub:** https://github.com/mluciani-tech/instituto-kalapa

## Estrutura do Projeto

```
src/
├── app/
│   ├── admin/page.tsx              # Painel administrativo
│   ├── api/
│   │   ├── admin/
│   │   │   ├── limpar/route.ts     # DELETE — limpa todos os registros
│   │   │   ├── login/route.ts      # POST — login do admin
│   │   │   ├── logout/route.ts     # POST — logout do admin
│   │   │   ├── participantes/route.ts # GET — lista participantes
│   │   │   └── verify/route.ts     # GET — verifica sessão
│   │   ├── send-email/route.ts     # POST — envia e-mail + salva no banco
│   │   └── vagas/route.ts          # GET — contagem de vagas
│   ├── checkout/page.tsx           # Página de checkout
│   ├── components/
│   │   ├── Checkout.tsx            # Componente de pagamento
│   │   ├── Footer.tsx              # Rodapé
│   │   ├── GroupExperience.tsx     # Seção de benefícios
│   │   ├── Hero.tsx                # Seção de abertura
│   │   ├── RegistrationForm.tsx    # Formulário + contador de vagas
│   │   └── VisualGallery.tsx       # Galeria de imagens
│   ├── globals.css                 # Tema e estilos globais
│   ├── layout.tsx                  # Layout raiz
│   └── page.tsx                    # Landing page
├── lib/
│   ├── auth.ts                     # Autenticação HMAC para admin
│   └── supabase.ts                 # Clientes Supabase (público + admin)
└── ...
```
