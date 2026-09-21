---
target: instituto-kalapa
total_score: 34
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-09-21T23-15-00Z
slug: instituto-kalapa
---
# Design Critique: Instituto Kalapa (Pós-Funcionalidades)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|:-----:|-----------|
| 1 | Visibility of System Status | 3.5 | Feedback visual em tempo real excelente (vagas, compartilhamento e acompanhantes); transição para InfinitePay pode exibir aviso de ambiente bancário seguro. |
| 2 | Match System / Real World | 3.5 | Vocabulário terapêutico e acolhedor bem integrado ("Garantir Vaga", "Sua Reserva", "Acompanhantes"). Pequenos resíduos de jargão de e-commerce ("Catálogo"). |
| 3 | User Control and Freedom | 3.0 | Excelente controle de carrinho e acompanhantes, porém falta botão de "Limpar Filtro / Ver Todas" em categorias com produtos vazios. |
| 4 | Consistency and Standards | 3.0 | Grande avanço: Checkout agora unificado com a paleta luminosa do Instituto. Risco de inconsistência residual na grafia ("INstituto" vs "Instituto") e link "Calendário". |
| 5 | Error Prevention | 3.5 | Conflito de estado prévio resolvido com sucesso! Validação rigorosa de campos de acompanhantes (Nome, Email, WhatsApp com máscara). |
| 6 | Recognition Rather Than Recall | 3.5 | PDP dedicada exibe tudo o que está incluído, vagas, valores e benefícios. Resumo do carrinho e checkout detalham titular e acompanhantes. |
| 7 | Flexibility and Efficiency | 3.5 | Compartilhamento nativo via Web Share API e cópia de link direta com 1 clique. Checkout guest sem fricção de cadastro. |
| 8 | Aesthetic and Minimalist Design | 3.0 | Visual editorial acolhedor e tons de santuário orgânico. Hero ainda possui 4 botões outline disputando atenção sem hierarquia primária/secundária. |
| 9 | Error Recovery | 3.0 | Mensagens de validação claras em português no formulário. Páginas com filtro vazio ainda não oferecem botão de retorno rápido. |
| 10 | Help and Documentation | 3.5 | Suporte direto via WhatsApp integrado no PDP, Catálogo e Rodapé; FAQ detalhado na página inicial cobrindo sigilo e preparação. |
| **Total** | | **34/40** | **Good (Evolução expressiva: de 18/40 para 34/40)** |

## Design Specificity Verdict

- **Evolução do Diagnóstico**: O projeto saltou de **18/40** para **34/40** após a eliminação dos gargalos estruturais mais críticos:
  1. Criação da **Página de Detalhes da Vivência (PDP)** (`/produtos/[slug]`) com metadados OpenGraph dinâmicos para WhatsApp/redes sociais;
  2. Unificação visual do **Checkout**, abandonando o dark mode destoante e abraçando a paleta luminosa e orgânica do Instituto (`brand-offwhite`, `brand-charcoal`, `brand-terracotta`);
  3. Resolução da corrida de estado entre o botão "Comprar" e os itens do `CartDrawer`;
  4. Fluxo humanizado de múltiplos participantes/acompanhantes no checkout e admin.
- **Identidade Visual**: A atmosfera do Instituto Kalapa transmite respeito, acolhimento e maturidade clínica. A remoção dos elementos cibernéticos (`StarBorder`) e a adoção de linhas douradas sutis (`#B8965A`) conferem a dignidade esperada de um centro de saúde integrativa.

## What's Working

1. **Compartilhamento Eficaz e Rápido**: O botão de compartilhamento com fallback inteligente (Web Share API nativa no mobile + cópia com aviso visual no desktop) torna orgânico o envio de vivências para contatos.
2. **Fluxo de Acompanhantes Humanizado**: O gatilho de $\ge 2$ unidades no carrinho ativa suavemente os campos de cada participante adicional, garantindo integridade de dados sem sobrecarregar quem compra apenas para si.
3. **Página de Detalhe Completa (PDP)**: O participante tem acesso a fotos do local, biografia da facilitadora, lista de benefícios incluídos e canal direto de acolhimento prévio via WhatsApp.
4. **Alvos de Toque Acessíveis**: Controles de quantidade e exclusão no carrinho respeitam a dimensão mínima de 44x44px recomendada pelo WCAG.

## Priority Issues (Recomendações Práticas)

- **[P1] Hierarquia do Hero e Link "Calendário" Vazio**:
  - *Problema*: O Hero na página inicial exibe quatro botões com o mesmo estilo outline (`glass-card`), gerando paralisia de escolha. Além disso, o botão e o item de menu "Calendário" levam para `/produtos?categoria=calendario`, onde não há itens cadastrados, gerando frustração.
  - *Ação Recomendada*:
    1. Definir uma ação primária no Hero com botão terracota sólido (ex.: `Explorar Vivências`) e manter as demais como secundárias.
    2. Ajustar o link "Calendário" para apontar para a seção de próximas turmas na Home ou abrir uma conversa direta sobre agenda no WhatsApp, caso não haja produtos nessa categoria.

- **[P1] Recuperação de Filtro Vazio no Catálogo (`ProductGrid`)**:
  - *Problema*: Quando uma categoria filtrada não possui serviços ativos, a tela exibe apenas o aviso *"Nenhum produto disponível no momento."* sem ação de escape.
  - *Ação Recomendada*: Adicionar um botão claro *"Ver todos os serviços"* e um botão secundário para tirar dúvidas via WhatsApp.

- **[P2] Padronização Tipográfica ("INstituto" $\rightarrow$ "Instituto")**:
  - *Problema*: Encontramos a grafia com duas maiúsculas `INstituto Kalapa` em `src/app/produtos/page.tsx` (`title`), no `Hero.tsx` e no link do Instagram do cabeçalho.
  - *Ação Recomendada*: Unificar a escrita para `Instituto Kalapa` para preservar o rigor institucional e a consistência visual.

- **[P2] Transição Informativa para o Gateway de Pagamento (InfinitePay)**:
  - *Problema*: Ao clicar em "Finalizar Reserva", o redirecionamento para o checkout externo ocorre sem um aviso explícito de que o usuário está sendo conduzido ao ambiente seguro da InfinitePay.
  - *Ação Recomendada*: No estado `processando`, exibir um banner ou micro-animação: *"Redirecionando para o ambiente bancário seguro da InfinitePay..."*.
