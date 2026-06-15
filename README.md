# Projeto: Prompt para Landing Page — Instituto Kalapa

## Objetivo da solicitação

Desenvolver um prompt de alta performance para estruturar uma landing page de conversão para o Instituto Kalapa, com foco na venda de ingressos para sessões terapêuticas em grupo quinzenais, utilizando pagamento via InfinitePay e estética cinematográfica.

## Estratégia utilizada

Foi aplicada a Arquitetura Modular, separando Persona, Contexto, Instruções de Sistema e Restrições. Utilize técnica de Chain of Thought (CoT) para forçar o modelo a raciocinar sobre a jornada do paciente antes de gerar o copy, e descrições fotorrealistas detalhadas para garantir a estética cinematográfica solicitada.

## Parâmetros escolhidos

- **Persona (System Instructions):** Arquiteto de UX/UI e Copywriter especialista em Psicologia e Conversão.
- **Contexto (Background):** Instituto Kalapa (terapias) + InfinitePay (fintech).
- **Gatilho Lógico:** "Pense passo a passo" (Zero-shot CoT) para aumentar a precisão na estrutura de vendas.
- **Formato de Saída:** Markdown estruturado para facilitar a visualização técnica.

## Justificativa técnica

A utilização de System Instructions calibra o tom de voz para o nicho terapêutico, evitando uma abordagem comercial agressiva que poderia afastar o público de psicologia. A inclusão de Restrições claras sobre o meio de pagamento (InfinitePay) e a periodicidade (15 dias) garante que a IA não alucine informações genéricas. A descrição visual segue as diretrizes de "Imagens fotorrealistas" documentadas, focando em iluminação e cenário.

## Boas práticas aplicadas

- **Precisão Quantitativa:** Definição exata de seções e campos de formulário.
- **Linguagem Unívoca:** Comandos diretos como "Estruture", "Descreva" e "Sintetize".
- **Modularização:** Separação entre a experiência do usuário (UX) e a interface visual (UI).

## Limitações documentadas

Como o link fornecido é externo e modelos de linguagem podem ter janelas de conhecimento datadas, o prompt instrui o modelo a focar na estrutura lógica e visual, cabendo ao usuário final inserir dados dinâmicos específicos (como valores exatos). Há risco de Ambiguidade Contextual se os temas específicos das sessões em grupo não forem detalhados no preenchimento final.

---

## Prompt final otimizado

======== INICIO DO PROMPT ========
Persona (System Instructions): Atue como um Especialista em Design de Conversão (CRO) e Arquiteto de Experiência do Usuário (UX) com foco no setor de saúde mental e terapias holísticas. Seu objetivo é projetar a estrutura completa de uma Landing Page para o "Instituto Kalapa".
Contexto e Objetivo:
Cliente: Instituto Kalapa (foco em psicologia e trabalhos terapêuticos).
Produto: Ingressos para sessões terapêuticas em grupo (Frequência: 1 vez a cada 15 dias).
Parceiro Financeiro: InfinitePay (meio exclusivo para processamento de pagamentos).
Estética Visual: Cinematográfica, moderna, acolhedora, utilizando pessoas reais e cenários que remetam à tranquilidade e ao autoconhecimento.
Estrutura da Landing Page (Modular):
Seção Hero (Abertura):
Headline que conecte a dor emocional à solução de grupo do Instituto Kalapa.
Subheadline explicando a dinâmica quinzenal.
Diretriz de Imagem: Descreva uma foto cinematográfica com profundidade de campo, mostrando uma pessoa em um momento de introspecção em um ambiente moderno e iluminado naturalmente (tons terrosos, verde menta e iluminação suave).
A Experiência do Grupo:
Copy explicativo sobre os benefícios da terapia em grupo quinzenal.
Use argumentos baseados em psicologia (acolhimento, pertencimento, cura coletiva).
Checkout e Meios de Pagamento (Powered by InfinitePay):
Seção dedicada à compra do ingresso.
Destaque a facilidade e segurança do pagamento via InfinitePay.
Liste opções de parcelamento e métodos (Pix/Cartão) processados pela InfinitePay.
Galeria Visual Cinematográfica:
Descreva 3 sugestões de imagens (prompts fotorrealistas) para compor a página:
Imagem 1: Close nas mãos de duas pessoas em um gesto de apoio mútuo.
Imagem 2: Um cenário de sala de estar moderna e minimalista onde ocorrem as sessões.
Imagem 3: Um grupo de pessoas diversas sorrindo de forma leve em um ambiente aberto.
Formulário de Inscrição:
Campos: Nome, E-mail, Telefone (WhatsApp) e "O que você busca com esta sessão?".
Instruções de Raciocínio (Chain of Thought): Pense passo a passo:
Como o design visual moderno pode reduzir o estigma da psicologia?
Como a integração da InfinitePay transmite profissionalismo e segurança para o cliente que está vulnerável emocionalmente? Reflita esses pontos no copy final da página.
Restrições:
Formato: Markdown estruturado.
Tom de voz: Empático, profissional e inspirador.
Proibido: Usar termos excessivamente "clínicos" ou frios. Foque no bem-estar.
Quantidade: Mínimo de 5 seções detalhadas.
======== FINAL DO PROMPT ========
