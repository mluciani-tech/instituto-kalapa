"use client";

import { useState } from "react";
import {
  BookOpen,
  Calendar,
  CreditCard,
  Tag,
  Users,
  ShoppingBag,
  Bell,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  FileText,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  LucideIcon,
} from "lucide-react";

interface ManualSection {
  id: string;
  title: string;
  icon: LucideIcon;
  summary: string;
  badge?: string;
}

export default function AdminManual() {
  const [activeSection, setActiveSection] = useState<string>("visao-geral");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const sections: ManualSection[] = [
    {
      id: "visao-geral",
      title: "1. Visão Geral da Arquitetura",
      icon: BookOpen,
      summary: "Entenda o ciclo completo: do visitante ao atendimento realizado.",
      badge: "Fundamental",
    },
    {
      id: "agenda",
      title: "2. Agenda & Atendimentos",
      icon: Calendar,
      summary: "Grade semanal, bloqueios de férias, e-mail da terapeuta e notificações.",
      badge: "Novo",
    },
    {
      id: "produtos",
      title: "3. Catálogo & Vagas",
      icon: ShoppingBag,
      summary: "Produtos com vagas por turma vs atendimentos individuais com agenda.",
    },
    {
      id: "checkout",
      title: "4. Checkout & InfinitePay",
      icon: CreditCard,
      summary: "PIX, Cartão de Crédito, parcelamento sem juros e webhooks automáticos.",
    },
    {
      id: "cupons",
      title: "5. Cupons de Desconto",
      icon: Tag,
      summary: "Criação de cupons %, valor fixo ou 100% cortesia com baixa automática.",
    },
    {
      id: "faq",
      title: "6. Dúvidas Frequentes & Resolução",
      icon: HelpCircle,
      summary: "Perguntas operacionais do dia a dia e procedimentos recomendados.",
    },
    {
      id: "changelog",
      title: "7. Histórico & Versões do Sistema",
      icon: Zap,
      summary: "Registro de atualizações contínuas e notas de versão do projeto.",
      badge: "v2.5",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner de Boas-Vindas */}
      <div className="bg-linear-to-r from-brand-purple via-purple-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-md mb-3">
            <BookOpen className="w-3.5 h-3.5 text-purple-200" />
            <span>Guia Oficial de Operação & Procedimentos</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Manual do Administrador — INstituto Kalapa
          </h1>
          <p className="text-xs sm:text-sm text-purple-100/90 mt-2 leading-relaxed">
            Bem-vindo(a)! Este manual foi projetado para capacitar qualquer membro da equipe ou novo administrador a operar com total segurança todas as funcionalidades do sistema: agendamentos, pagamentos, cupons, inscrições e catálogo.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-purple-200">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-300" /> Sistema Seguro (RLS & Webhook HMAC)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-amber-300" /> Fuso Oficial: Horário de Brasília (UTC-3)
            </span>
          </div>
        </div>
      </div>

      {/* Grid de Navegação de Seções */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Menu Lateral de Seções */}
        <div className="md:col-span-1 space-y-2">
          <div className="bg-white rounded-2xl border border-brand-beige p-3 shadow-xs">
            <h3 className="text-xs font-bold text-brand-charcoal/50 uppercase tracking-wider px-3 py-2">
              Sumário do Manual
            </h3>
            <div className="space-y-1">
              {sections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setActiveSection(sec.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer ${
                      isActive
                        ? "bg-purple-50 text-brand-purple border border-purple-200 shadow-xs"
                        : "hover:bg-brand-beige-light text-brand-charcoal/80"
                    }`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? "text-brand-purple" : "text-brand-charcoal/50"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{sec.title}</span>
                        {sec.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                              sec.badge === "Novo"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-purple-100 text-brand-purple"
                            }`}
                          >
                            {sec.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-brand-charcoal/50 truncate mt-0.5">
                        {sec.summary}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dica rápida de suporte */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-900 text-xs space-y-1.5">
            <p className="font-bold flex items-center gap-1.5">
              <span>💬</span> Dúvida técnica?
            </p>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Em caso de dúvidas sobre regras de banco de dados ou integração com a InfinitePay, consulte a documentação técnica da equipe de engenharia.
            </p>
          </div>
        </div>

        {/* Conteúdo Detalhado da Seção Selecionada */}
        <div className="md:col-span-3">
          {/* SEÇÃO 1: VISÃO GERAL */}
          {activeSection === "visao-geral" && (
            <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-brand-charcoal">
                  1. Visão Geral da Arquitetura do Sistema
                </h2>
                <p className="text-xs text-brand-charcoal/70 mt-1">
                  O sistema do INstituto Kalapa é dividido em duas frentes complementares: Experiências de Grupo (Vivências/Cursos com controle de vagas) e Atendimentos Terapêuticos Individuais (com agendamento prévio).
                </p>
              </div>

              {/* Diagrama Visual de Fluxo */}
              <div className="bg-brand-beige-light/60 p-5 rounded-xl border border-brand-beige">
                <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span>🗺️</span> Fluxo de Navegação & Conversão do Cliente
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-white p-3.5 rounded-xl border border-brand-beige shadow-xs">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-brand-purple font-bold flex items-center justify-center mx-auto mb-2 text-xs">
                      1
                    </div>
                    <p className="text-xs font-bold text-brand-charcoal">Vitrine / Catálogo</p>
                    <p className="text-[11px] text-brand-charcoal/60 mt-1">
                      Cliente escolhe Vivência em Grupo ou Atendimento Individual.
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-brand-beige shadow-xs">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-brand-purple font-bold flex items-center justify-center mx-auto mb-2 text-xs">
                      2
                    </div>
                    <p className="text-xs font-bold text-brand-charcoal">Escolha de Horário</p>
                    <p className="text-[11px] text-brand-charcoal/60 mt-1">
                      Se for atendimento individual, seleciona dia e hora (Hold de 15 min).
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-brand-beige shadow-xs">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-brand-purple font-bold flex items-center justify-center mx-auto mb-2 text-xs">
                      3
                    </div>
                    <p className="text-xs font-bold text-brand-charcoal">Checkout Seguro</p>
                    <p className="text-[11px] text-brand-charcoal/60 mt-1">
                      Login/cadastro obrigatório, cupom opcional e pagamento na InfinitePay.
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-brand-beige shadow-xs">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mx-auto mb-2 text-xs">
                      ✓
                    </div>
                    <p className="text-xs font-bold text-emerald-800">Confirmação & Avisos</p>
                    <p className="text-[11px] text-emerald-700 mt-1">
                      Status confirmado, e-mails disparados e Toast emitido no Admin.
                    </p>
                  </div>
                </div>
              </div>

              {/* Divisão dos Tipos de Produtos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border-2 border-brand-terracotta/30 bg-orange-50/30 space-y-2">
                  <h4 className="text-xs font-bold text-brand-terracotta flex items-center gap-1.5">
                    <Users className="w-4 h-4" /> Vivências & Cursos (Em Grupo)
                  </h4>
                  <ul className="text-xs text-brand-charcoal/80 space-y-1 list-disc list-inside">
                    <li>Controle de vagas máximas e preenchidas (ex: 15 vagas).</li>
                    <li>Permite compra direta de ingressos/vagas.</li>
                    <li>Cadastro de participantes beneficiários opcionais.</li>
                    <li>Exibe badge de vagas restantes e "Quase Esgotado".</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border-2 border-brand-purple/30 bg-purple-50/30 space-y-2">
                  <h4 className="text-xs font-bold text-brand-purple flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> Atendimentos Terapêuticos (Individuais)
                  </h4>
                  <ul className="text-xs text-brand-charcoal/80 space-y-1 list-disc list-inside">
                    <li>Exige agendamento prévio antes do checkout.</li>
                    <li>O cliente escolhe data e horário na agenda da terapeuta.</li>
                    <li>Gera bloqueio provisório (Hold 15 min) para evitar choques.</li>
                    <li>Notifica a terapeuta via e-mail e alerta o admin via Toast.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SEÇÃO 2: AGENDA */}
          {activeSection === "agenda" && (
            <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-brand-charcoal">
                  2. Módulo de Agenda & Atendimentos
                </h2>
                <p className="text-xs text-brand-charcoal/70 mt-1">
                  Gerenciamento da rotina profissional das facilitadoras/terapeutas, horários de atendimento, bloqueios e alertas de agendamento.
                </p>
              </div>

              {/* Cards explicativos das 4 sub-abas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-brand-beige-light/50 border border-brand-beige space-y-2">
                  <h4 className="font-bold text-brand-purple flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Consultas & Atendimentos
                  </h4>
                  <p className="text-brand-charcoal/70">
                    Lista todas as consultas realizadas e futuras. Permite filtrar por status (Confirmado, Hold, Concluído, Cancelado), ver dados do paciente com link direto para o WhatsApp e registrar cancelamentos justificados.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-brand-beige-light/50 border border-brand-beige space-y-2">
                  <h4 className="font-bold text-brand-purple flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Grade Semanal de Trabalho
                  </h4>
                  <p className="text-brand-charcoal/70">
                    Define quais dias da semana e turnos (Manhã: ex. 09h às 12h / Tarde: ex. 14h às 18h) estão abertos para reservas, além da duração das sessões (50 min) e intervalo de respiro (10 min).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-brand-beige-light/50 border border-brand-beige space-y-2">
                  <h4 className="font-bold text-brand-purple flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Bloqueios & Exceções
                  </h4>
                  <p className="text-brand-charcoal/70">
                    Permite fechar dias específicos de feriado, férias ou compromissos médicos pontuais sem precisar alterar a grade fixa semanal.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-brand-beige-light/50 border border-brand-beige space-y-2">
                  <h4 className="font-bold text-brand-purple flex items-center gap-2">
                    <Bell className="w-4 h-4" /> Configurações & SMTP Hostinger
                  </h4>
                  <p className="text-brand-charcoal/70">
                    Onde o administrador cadastra o e-mail da terapeuta e preenche as credenciais do <strong>SMTP da Hostinger</strong> (Host: <code>smtp.hostinger.com</code>, Porta: 465, Usuário e Senha), permitindo disparar avisos e testes diretamente pela conta corporativa.
                  </p>
                </div>
              </div>

              {/* Passo a passo: Como agendar ou alterar */}
              <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-200 text-xs space-y-2">
                <p className="font-bold text-brand-purple">
                  Regras Cruciais de Agendamento que Você Deve Saber:
                </p>
                <ul className="list-disc list-inside space-y-1 text-brand-charcoal/80">
                  <li><strong>Antecedência Mínima de 4 Horas:</strong> O cliente não consegue agendar uma sessão com menos de 4 horas de antecedência, dando tempo para a terapeuta se preparar.</li>
                  <li><strong>Reserva Temporária (Hold de 15 min):</strong> Enquanto o cliente está na tela de pagamento, o horário fica bloqueado para que ninguém mais o selecione. Se não houver pagamento em 15 minutos, o horário é liberado automaticamente.</li>
                  <li><strong>Notificação Imediata:</strong> Ao confirmar o pagamento, tanto o terapeuta quanto a administração são informados e o Toast no Admin salta na tela.</li>
                </ul>
              </div>
            </div>
          )}

          {/* SEÇÃO 3: PRODUTOS */}
          {activeSection === "produtos" && (
            <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-brand-charcoal">
                  3. Gerenciamento do Catálogo & Vagas
                </h2>
                <p className="text-xs text-brand-charcoal/70 mt-1">
                  Como cadastrar novos serviços, definir valores, turmas e alternar entre produto de grupo ou atendimento individual.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="border border-brand-beige rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-brand-charcoal">
                    Como criar um produto de Atendimento Individual?
                  </h4>
                  <p className="text-brand-charcoal/70 leading-relaxed">
                    1. Vá na aba <strong>Produtos</strong> e clique em <strong>Novo Produto</strong>.<br />
                    2. Preencha Nome, Descrição e Valor.<br />
                    3. Na opção <strong>Tipo de Produto</strong>, selecione <strong>Atendimento Terapêutico Individual</strong> (isso ativa a flag <code className="bg-gray-100 px-1 py-0.5 rounded">atendimento_individual = true</code>).<br />
                    4. Salve o produto. Na vitrine pública, o botão mudará automaticamente de <em>"Inscrever-se"</em> para <em>"Agendar Sessão"</em> e solicitará a escolha de data antes do pagamento.
                  </p>
                </div>

                <div className="border border-brand-beige rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-brand-charcoal">
                    Como controlar vagas de Vivências em Grupo?
                  </h4>
                  <p className="text-brand-charcoal/70 leading-relaxed">
                    1. Em produtos normais de grupo, insira o número em <strong>Vagas Máximas</strong> (ex: 15).<br />
                    2. O sistema calcula automaticamente: <code>Vagas Restantes = Vagas Máximas - Vagas Pagas</code>.<br />
                    3. Caso você queira ajustar manualmente vagas preenchidas fora do site (ex: transferências bancárias manuais), use o campo de ajuste manual de vagas na edição do produto.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SEÇÃO 4: CHECKOUT & PAGAMENTOS */}
          {activeSection === "checkout" && (
            <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-brand-charcoal">
                  4. Checkout, Gateway InfinitePay & Webhooks
                </h2>
                <p className="text-xs text-brand-charcoal/70 mt-1">
                  Como o dinheiro entra, como o status é atualizado e o que fazer em caso de verificação de pedidos.
                </p>
              </div>

              <div className="bg-brand-beige-light/50 p-4 rounded-xl border border-brand-beige space-y-3 text-xs">
                <h4 className="font-bold text-brand-purple flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Métodos de Pagamento Suportados
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-brand-beige">
                    <p className="font-bold text-brand-charcoal">PIX (Instantâneo)</p>
                    <p className="text-[11px] text-brand-charcoal/60 mt-1">
                      Gera QR Code dinâmico com chave copia e cola via InfinitePay. Confirmação instantânea em poucos segundos após a leitura.
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-brand-beige">
                    <p className="font-bold text-brand-charcoal">Cartão de Crédito</p>
                    <p className="text-[11px] text-brand-charcoal/60 mt-1">
                      Com parcelamento configurável em até 10x ou 12x sem juros absorvidos pela instituição, aprovação direta antifraude.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-2">
                <p className="font-bold text-amber-900">
                  O que é o Webhook da InfinitePay?
                </p>
                <p className="text-amber-800 leading-relaxed">
                  Quando o cliente paga, a InfinitePay envia um sinal criptografado para o endpoint <code className="bg-white/80 px-1 py-0.5 rounded">/api/webhook</code>. O sistema valida a assinatura HMAC, marca o pedido como <strong>pago</strong>, confirma a vaga/agendamento e envia os e-mails automaticamente. Não é necessária intervenção manual para liberar a compra!
                </p>
              </div>
            </div>
          )}

          {/* SEÇÃO 5: CUPONS */}
          {activeSection === "cupons" && (
            <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-brand-charcoal">
                  5. Gestão de Cupons de Desconto
                </h2>
                <p className="text-xs text-brand-charcoal/70 mt-1">
                  Crie campanhas promocionais, parcerias ou gratuidades para bolsistas e convidados.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-brand-beige-light/60 p-4 rounded-xl border border-brand-beige space-y-1.5">
                  <p className="font-bold text-brand-purple">Porcentagem (%)</p>
                  <p className="text-brand-charcoal/70">
                    Aplica um desconto percentual sobre o subtotal do carrinho (ex: <code>DESCONTO15</code> para 15% OFF).
                  </p>
                </div>

                <div className="bg-brand-beige-light/60 p-4 rounded-xl border border-brand-beige space-y-1.5">
                  <p className="font-bold text-brand-purple">Valor Fixo (R$)</p>
                  <p className="text-brand-charcoal/70">
                    Abate um valor exato em Reais (ex: <code>AMIGO50</code> para R$ 50,00 de desconto).
                  </p>
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-1.5">
                  <p className="font-bold text-emerald-800">Cupom Cortesia (100%)</p>
                  <p className="text-emerald-700">
                    Cupons de 100% liberam o pedido imediatamente sem passar por cartão ou banco, confirmando a inscrição direto.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SEÇÃO 6: FAQ */}
          {activeSection === "faq" && (
            <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-brand-charcoal">
                  6. Dúvidas Frequentes & Procedimentos Administrativos
                </h2>
                <p className="text-xs text-brand-charcoal/70 mt-1">
                  Respostas rápidas para situações rotineiras de atendimento ao cliente.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    q: "Um cliente pediu para cancelar ou reagendar a sessão. O que devo fazer?",
                    a: "Acesse a aba '🗓️ Agenda & Atendimentos', localize a consulta do paciente e clique no botão 'Cancelar Consulta'. O sistema solicitará uma justificativa obrigatória por escrito, liberará o horário na grade para outros pacientes e registrará a ocorrência na auditoria.",
                  },
                  {
                    q: "O cliente pagou no PIX mas diz que não recebeu e-mail. Como verificar?",
                    a: "Acesse a aba 'Pedidos' e busque pelo nome ou e-mail do cliente. Se o status estiver 'pago', o agendamento foi confirmado. Lembre-se de orientar o cliente a checar a caixa de Spam/Promoções. O Resend envia as confirmações com remitente oficial.",
                  },
                  {
                    q: "Como alterar a facilitadora/terapeuta que recebe as notificações?",
                    a: "Na aba 'Agenda & Atendimentos', clique na sub-aba 'Configurações & Notificações'. Digite o novo endereço de e-mail e clique em 'Salvar Configurações'. Você pode clicar em 'Enviar E-mail de Teste' para se certificar de que está recebendo na caixa postal correta.",
                  },
                  {
                    q: "Preciso pausar os agendamentos no feriado ou recesso de fim de ano?",
                    a: "Não é necessário mexer na grade fixa de horários! Vá na sub-aba 'Bloqueios & Exceções', selecione a data do feriado, marque 'Bloquear o dia inteiro' e salve. Os horários serão ocultados imediatamente da vitrine do cliente.",
                  },
                ].map((item, index) => (
                  <div key={index} className="border border-brand-beige rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full text-left p-4 bg-brand-beige-light/40 hover:bg-brand-beige-light transition-colors flex items-center justify-between text-xs font-bold text-brand-charcoal cursor-pointer"
                    >
                      <span>{item.q}</span>
                      {expandedFaq === index ? <ChevronUp className="w-4 h-4 text-brand-purple" /> : <ChevronDown className="w-4 h-4 text-brand-charcoal/40" />}
                    </button>
                    {expandedFaq === index && (
                      <div className="p-4 bg-white text-xs text-brand-charcoal/80 leading-relaxed border-t border-brand-beige">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEÇÃO 7: CHANGELOG & VERSÕES */}
          {activeSection === "changelog" && (
            <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-brand-beige">
                <div>
                  <h2 className="text-lg font-bold text-brand-charcoal">
                    7. Versões do Sistema & Notas de Atualização
                  </h2>
                  <p className="text-xs text-brand-charcoal/70 mt-1">
                    Mecanismo dinâmico de documentação: sempre que houver novas melhorias ou correções, este histórico é atualizado para manter a equipe informada.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-purple-100 text-brand-purple font-mono font-bold text-xs">
                  Versão Atual: v2.5.0
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative pl-6 border-l-2 border-brand-purple space-y-1.5">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-brand-purple" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-brand-purple">v2.5.0</span>
                    <span className="text-[10px] text-brand-charcoal/50">Setembro / 2026</span>
                  </div>
                  <h4 className="font-bold text-xs text-brand-charcoal">
                    Notificações de Agendamento, Toast no Admin & Manual do Usuário
                  </h4>
                  <ul className="text-xs text-brand-charcoal/70 list-disc list-inside space-y-0.5">
                    <li>Novo campo para configurar o e-mail de notificação de cada terapeuta com fallback inteligente.</li>
                    <li>Disparo de e-mail detalhado para a terapeuta a cada agendamento confirmado (com link WhatsApp).</li>
                    <li>Notificação tipo Toast flutuante no painel Admin alertando novos agendamentos confirmados.</li>
                    <li>Criação desta aba oficial de Manual do Usuário com diagramas visuais e guia operacional completo.</li>
                  </ul>
                </div>

                <div className="relative pl-6 border-l-2 border-brand-beige space-y-1.5">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-brand-beige" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-brand-charcoal/70">v2.4.0</span>
                    <span className="text-[10px] text-brand-charcoal/50">Setembro / 2026</span>
                  </div>
                  <h4 className="font-bold text-xs text-brand-charcoal">
                    Módulo de Calendário Nativo & Suporte a Atendimentos Individuais
                  </h4>
                  <ul className="text-xs text-brand-charcoal/70 list-disc list-inside space-y-0.5">
                    <li>Flag de produto <code className="bg-gray-100 px-1 py-0.5 rounded">atendimento_individual</code> no cadastro de produtos.</li>
                    <li>Grade semanal de horários com janelas da manhã e tarde, duração de 50 min e buffer de 10 min.</li>
                    <li>Bloqueios manuais de data e horário com motivo opcional.</li>
                    <li>Fluxo de reserva obrigatória na vitrine com Hold de 15 minutos e vínculo ao pedido da InfinitePay.</li>
                  </ul>
                </div>

                <div className="relative pl-6 border-l-2 border-brand-beige space-y-1.5">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-brand-beige" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-brand-charcoal/70">v2.3.0</span>
                    <span className="text-[10px] text-brand-charcoal/50">Agosto / 2026</span>
                  </div>
                  <h4 className="font-bold text-xs text-brand-charcoal">
                    Checkout Transparente InfinitePay & Sistema de Cupons
                  </h4>
                  <ul className="text-xs text-brand-charcoal/70 list-disc list-inside space-y-0.5">
                    <li>Integração direta com o checkout da InfinitePay com validação HMAC de webhook.</li>
                    <li>Módulo de cupons com desconto em porcentagem, valor fixo e cupons 100% gratuitos.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
