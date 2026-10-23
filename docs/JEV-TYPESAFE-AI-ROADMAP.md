# Planejamento & Avaliação de Integração: Jev (TypeSafe AI)

> **Data de Registro:** 11 de Outubro de 2026  
> **Status:** Em avaliação para implementação futura  
> **Stack do Projeto:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Supabase (PostgreSQL), Resend.

---

## 1. O que é o Jev (TypeSafe AI)
O **Jev** é um modelo discriminativo de inteligência artificial desenvolvido pela [TypeSafe AI](https://typesafe.ai). Diferente de LLMs autoregressivos tradicionais (que geram textos palavra por palavra), o Jev opera como um modelo de **Sistema 1** (raciocínio rápido e estruturado), projetado para tomada de decisões com **latência ultra-baixa (70ms a 300ms)** e saída 100% tipada.

### Formatos Nativos de Resposta
* **`Choice`:** Escolha determinística entre opções pré-definidas (com score de probabilidade/confiança).
* **`Score`:** Classificação em escala ordinal ou pontuação de relevância.
* **`Noul`:** Estimativa probabilística de verdadeiro/falso (sim/não).

---

## 2. Oportunidades Identificadas no Instituto Kalapa

### A. Triagem e Recomendação Inteligente de Vivências (Smart Router)
* **Objetivo:** Ajudar o visitante indeciso a encontrar a vivência/terapia ideal.
* **Mecanismo:** O usuário responde a uma breve pergunta aberta (ex: *"Qual é o momento ou desafio que você busca acolher agora?"*). Em ~100ms, o Jev classifica a intenção em um `Choice` com o ID da vivência (ex: *Constelação Familiar*, *Atendimento Individual 90min*, etc.) e exibe a recomendação com score de confiança.
* **Impacto:** Aumento direto na conversão de vendas na vitrine.

### B. Desempate e Refinamento nos Testes de Autoconhecimento
* **Objetivo:** Refinar diagnósticos nos testes existentes (*Eneagrama*, *Yin-Yang*, *Cronotipo*, *Lealdades Invisíveis*).
* **Mecanismo:** Quando um resultado estiver em empate ou margem muito estreita entre dois tipos, o Jev avalia o padrão global das respostas e realiza a classificação qualitativa (`Choice`/`Score`) sem necessidade de regras manuais complexas.
* **Impacto:** Resultados mais precisos e personalizados para os consulentes.

### C. Classificação Prévia de Demandas para Facilitadoras
* **Objetivo:** Auxiliar a preparação da terapeuta antes da sessão individual.
* **Mecanismo:** Análise da observação deixada no agendamento para gerar tags automáticas no painel admin (ex: *Relacionamento*, *Luto*, *Carreira*, *Transição de Vida*) e nível de prioridade.
* **Impacto:** Melhor acolhimento e agilidade no atendimento clínico.

---

## 3. Benefícios Técnicos para o Código do Kalapa

1. **Type-Safety Nativo (TypeScript):**
   * O projeto Kalapa é 100% tipado. O SDK (`typesafe-sdk-js` / `@typesafe-ai/sdk`) retorna respostas com validação de tipos em tempo de compilação, eliminando problemas de alucinação de JSON ou parsing quebrado em rotas de API do Next.js.
2. **Performance e Baixo Custo:**
   * Execução em menos de 300ms, sem deixar o usuário esperando carregamentos longos.
   * Custo operacional significativamente menor por requisição se comparado a LLMs pesados.

---

## 4. Próximos Passos (Quando for Implementar)
1. Criar conta e credenciais de API no painel da [TypeSafe AI](https://docs.typesafe.ai).
2. Adicionar variável de ambiente `TYPESAFE_API_KEY` no `.env.local` e no painel da Hostinger.
3. Instalar o SDK oficial via `npm install @typesafe-ai/sdk` (ou `typesafe-sdk-js`).
4. Desenvolver uma rota piloto isolada (ex: `/src/app/api/triagem/route.ts`) para validação antes de plugar na interface pública.
