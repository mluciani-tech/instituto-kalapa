# Instituto Kalapa — Plataforma Web & Painel Administrativo

Plataforma oficial do **Instituto Kalapa** com catálogo de experiências, controle de vagas em tempo real via Supabase, fluxo de agendamento terapêutico individual, pagamentos via InfinitePay (Pix e Cartão), notificações por e-mail corporativo via SMTP Hostinger / Resend e painel administrativo completo com menu lateral responsivo.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router) + Turbopack
- **Linguagem:** TypeScript
- **Estilos:** Tailwind CSS v4
- **Animações:** Framer Motion + ReactBits / Magic UI
- **Banco de Dados:** Supabase (PostgreSQL + RLS)
- **Gateway de Pagamento:** InfinitePay API (Pix dinâmico e Cartão até 12x com validação de webhook HMAC)
- **E-mails:** SMTP Hostinger Corporativo (`smtp.hostinger.com:465` SSL) + Resend (com fallback mock)
- **Ícones:** Lucide React
- **Deploy:** Vercel

---

## Funcionalidades Principais

### Área Pública & E-commerce
- **Hero & Narrativa:** Apresentação institucional com imagem real e tipografia refinada.
- **Autoavaliações (Testes):**
  - **Teste Yin/Yang (MTC):** Diagnóstico clínico baseado na Medicina Tradicional Chinesa com metrônomo respiratório e dietoterapia.
  - **Teste de Eneagrama:** Mapeamento de personalidade em 9 tipos fundamentais, revelando a motivação central, medos, vícios emocionais e caminhos de integração.
  - **Teste de Lealdades Invisíveis:** Baseado nas Constelações Familiares de Bert Hellinger, identifica emaranhamentos sistêmicos (ex: "Sigo você", "Exclusão") e entrega frases de solução.
  - *Características gerais:* Autenticação exigida, emissão/impressão com 1 clique de **Relatório em PDF (formato A4)** com dados e conclusões detalhadas, e fotografias editoriais geradas por IA.
- **Recuperação Autônoma de Senha:**
  - Fluxo de autoatendimento no `/login` com token temporário de 1 hora via SMTP Hostinger corporativo.
  - Formato multipart (HTML + Texto Puro) garantindo alta entregabilidade sem bloqueio de spam.
- **Catálogo Duplo & Compartilhamento Social:**
  - *Vivências & Cursos (Em Grupo):* Controle de vagas máximas e preenchidas, badges dinâmicos de disponibilidade.
  - *Atendimentos Individuais:* Escolha prévia de data e horário na agenda antes do pagamento com reserva temporária (*Hold* de 15 min).
  - *Compartilhamento Único & OpenGraph:* Links de compartilhamento individualizados por ID no WhatsApp, Web Share e cópia de link, garantindo prévias fiéis em redes sociais sem colisão de slugs legados.
- **Checkout Seguro:**
  - Identificação de cliente, aplicação de cupons (%, valor fixo ou cortesia 100%).
  - Pix com QR Code dinâmico e Cartão de Crédito.
  - Confirmação com comprovante e links diretos para contato via WhatsApp.

### Painel Administrativo (`/admin`)
- **Novo Menu Lateral (Sidebar):**
  - *Desktop:* Barra lateral fixa à esquerda com 9 abas organizadas, contadores dinâmicos, alertas pulsantes para novos agendamentos e rodapé integrado com atalho para catálogo e logout.
  - *Mobile:* Drawer deslizante acionado por botão hambúrguer com fechamento rápido ao toque no fundo escurecido.
- **Gestão de Produtos:**
  - CRUD completo, upload de fotos no Supabase Storage, alternância entre turma de grupo ou atendimento individual, ajuste manual de vagas.
  - Geração automática de slug a partir do nome do produto (`slugify`).
  - Total flexibilidade para produtos compartilharem categorias ou termos de slug sem restrições ou bloqueios no painel.
- **Agenda & Atendimentos:**
  - Grade semanal de disponibilidade da terapeuta (turnos manhã e tarde, sessões de 50 min com intervalo).
  - Bloqueios de feriados e férias sem afetar a grade fixa.
  - Gestão de consultas (confirmadas, em hold, concluídas, canceladas com justificativa).
  - Configurações com máscara automática para WhatsApp `(11) 99999-9999` e validação estrita de e-mail.
  - Botão de envio de e-mail de teste para validação de entrega.
- **Pedidos & Inscrições:**
  - Filtros avançados por status financeiro (pagos, pendentes, cancelados) e produto.
  - Busca em tempo real, visualização de acompanhantes/beneficiários e edição de dados de contato.
  - Emissão de Lista de Convidados formatada para impressão/PDF.
- **Cupons de Desconto:** Criação de cupons por porcentagem, valor fixo, limite de usos e validade.
- **Usuários:** Lista completa de clientes com dados de contato, endereço e histórico de compras.
- **Manual do Sistema Integrado:** Guia oficial com diagramas visuais e procedimentos operacionais totalmente harmonizado na paleta da marca.
- **Toast Notifications:** Alertas em tempo real na tela quando novos agendamentos são confirmados.

---

## Variáveis de Ambiente (`.env.local`)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Chave pública (anon) do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim | Chave de serviço do Supabase (server-only) |
| `ADMIN_PASSWORD` | Sim | Senha de acesso ao painel `/admin` |
| `SESSION_SECRET` | Sim | Segredo para assinatura de cookies e tokens HMAC |
| `WEBHOOK_SECRET` | Sim | Segredo para validação de webhook da InfinitePay |
| `INFINITEPAY_HANDLE` | Sim | Identificador InfinitePay para geração de links |
| `NEXT_PUBLIC_SITE_URL` | Sim | URL pública do site (redirecionamentos e webhooks) |
| `RESEND_API_KEY` | Não | Chave da API Resend (fallback se SMTP não estiver configurado) |
| `KALAPA_EMAIL_FROM` | Não | E-mail de remetente padrão |
| `KALAPA_EMAIL_TO` | Não | Destinatário padrão de notificações administrativas |

> **Nota sobre SMTP:** As credenciais do SMTP da Hostinger (`smtp_host`, `smtp_port`, `smtp_user`, `smtp_pass`) são gerenciadas de forma persistente e dinâmica diretamente pelo banco de dados na tabela `configuracoes` através da interface administrativa.

---

## Scripts Disponíveis

```bash
npm run dev          # Iniciar ambiente de desenvolvimento (porta 3000)
npm run build        # Executar build de produção com Turbopack
npm run start        # Subir servidor Node de produção
npm run typecheck    # Verificação estrita de tipagem TypeScript (tsc --noEmit)
npm run lint         # Análise estática de código com ESLint
```

---

## Identidade Visual & Cores do Sistema

| Nome | Hexadecimal | Utilização |
|---|---|---|
| **Brand Purple** | `#1A3C4D` | Cor primária, cabeçalhos, sidebar, botões principais |
| **Brand Purple Dark** | `#142F3D` | Hover de botões, gradientes profundos |
| **Brand Purple Deep** | `#0D1E28` | Fundos contrastantes e banners |
| **Brand Terracotta** | `#B8965A` | Acentos dourados, destaques, bordas ativas, tags |
| **Brand Mint** | `#7D8C6E` | Status confirmado, sucesso, botões positivos |
| **Brand Charcoal** | `#4A4A4A` | Tipografia base e textos de leitura |
| **Brand Beige** | `#EDE7DB` | Bordas e divisores sutis |
| **Brand Beige Light** | `#F8F4ED` | Fundo principal da aplicação |

---

## Links & Produção

- **Site Oficial:** [https://www.institutokalapa.com.br](https://www.institutokalapa.com.br)
- **Painel Administrativo:** [https://www.institutokalapa.com.br/admin](https://www.institutokalapa.com.br/admin)
- **Repositório GitHub:** [https://github.com/mluciani-tech/instituto-kalapa](https://github.com/mluciani-tech/instituto-kalapa)
