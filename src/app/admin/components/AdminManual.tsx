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
  ShieldCheck,
  Zap,
  HelpCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  LucideIcon,
  Mail,
  Smartphone,
  Lock,
  AlertCircle,
  AlertTriangle,
  KeyRound,
  Share2,
  Sparkles,
  Printer,
  Wind,
  Flame,
  Droplets,
  Scale,
  Utensils,
  Coffee,
  Database,
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
      title: "1. Visão Geral & Novo Menu Lateral",
      icon: LayoutDashboard,
      summary: "Entenda o ciclo completo e a nova navegação lateral do painel admin.",
      badge: "Atualizado",
    },
    {
      id: "agenda",
      title: "2. Agenda & Notificações Hostinger",
      icon: Calendar,
      summary: "3 turnos (Manhã/Tarde/Noite), bloqueios, e-mail da terapeuta e SMTP corporativo.",
      badge: "Atualizado",
    },
    {
      id: "produtos",
      title: "3. Catálogo & Vagas",
      icon: ShoppingBag,
      summary: "Produtos com vagas por turma vs atendimentos individuais com tempo de consulta e agenda.",
      badge: "Atualizado",
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
      id: "teste-yin-yang",
      title: "6. Avaliações & Laudos PDF (Yin/Yang, Eneagrama & Cronotipo)",
      icon: Sparkles,
      summary: "Módulos de Yin/Yang, Eneagrama e Cronotipo circadiano, captação de leads, laudos A4 e métricas gerenciais.",
      badge: "Novo",
    },
    {
      id: "seguranca",
      title: "7. Segurança & Recuperação de Senha",
      icon: ShieldCheck,
      summary: "Autoatendimento de recuperação de senha, suporte manual no admin, SMTP Hostinger e credenciais.",
      badge: "Atualizado",
    },
    {
      id: "faq",
      title: "8. Dúvidas Frequentes & Resolução",
      icon: HelpCircle,
      summary: "Perguntas operacionais do dia a dia e procedimentos recomendados.",
    },
    {
      id: "changelog",
      title: "9. Histórico & Versões do Sistema",
      icon: Zap,
      summary: "Registro de atualizações contínuas e notas de versão do projeto.",
      badge: "v2.11",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner de Boas-Vindas - Paleta Oficial Kalapa */}
      <div className="bg-gradient-to-r from-brand-purple-deep via-brand-purple to-brand-purple-dark rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md mb-3 text-brand-beige">
            <BookOpen className="w-3.5 h-3.5 text-brand-terracotta" />
            <span>Guia Oficial de Operação & Procedimentos</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Manual do Administrador — INstituto Kalapa
          </h1>
          <p className="text-xs sm:text-sm text-brand-beige-light/90 mt-2 leading-relaxed">
            Bem-vindo(a)! Este manual foi projetado para capacitar qualquer membro da equipe ou novo administrador a operar com total segurança todas as funcionalidades do sistema: novo menu lateral, agendamentos terapêuticos, SMTP corporativo Hostinger, pagamentos, cupons, inscrições e catálogo.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-brand-beige/80">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-mint" /> Sistema Seguro (RLS & Webhook HMAC)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-terracotta" /> Fuso Oficial: Horário de Brasília (UTC-3)
            </span>
          </div>
        </div>
      </div>

      {/* Grid de Navegação de Seções */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Menu Lateral de Seções do Manual */}
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
                        ? "bg-brand-purple/10 text-brand-purple border border-brand-purple/20 shadow-xs font-semibold"
                        : "hover:bg-brand-beige-light text-brand-charcoal/80 border border-transparent"
                    }`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? "text-brand-purple" : "text-brand-charcoal/50"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{sec.title}</span>
                        {sec.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                              sec.badge === "Novo" || sec.badge === "Atualizado"
                                ? "bg-brand-mint/20 text-brand-mint font-semibold"
                                : "bg-brand-terracotta/20 text-brand-terracotta font-semibold"
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
          <div className="bg-brand-beige-light border border-brand-beige rounded-2xl p-4 text-brand-charcoal text-xs space-y-1.5">
            <p className="font-bold flex items-center gap-1.5 text-brand-purple">
              <span>💬</span> Dúvida técnica?
            </p>
            <p className="text-[11px] text-brand-charcoal/70 leading-relaxed">
              Em caso de dúvidas sobre regras de banco de dados, integração com a InfinitePay ou credenciais SMTP da Hostinger, consulte o suporte técnico.
            </p>
          </div>
        </div>

        {/* Conteúdo Detalhado da Seção Selecionada */}
        <div className="md:col-span-3">
          {/* SEÇÃO 1: VISÃO GERAL & MENU LATERAL */}
          {activeSection === "visao-geral" && (
            <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-brand-charcoal">
                  1. Visão Geral da Arquitetura & Novo Menu Lateral
                </h2>
                <p className="text-xs text-brand-charcoal/70 mt-1">
                  O sistema do INstituto Kalapa é dividido em duas frentes complementares: Experiências de Grupo (Vivências/Cursos com controle de vagas) e Atendimentos Terapêuticos Individuais (com agendamento prévio).
                </p>
              </div>

              {/* Destaque: Novo Menu Lateral */}
              <div className="bg-brand-beige-light/70 p-5 rounded-xl border border-brand-beige space-y-3">
                <h4 className="text-xs font-bold text-brand-purple uppercase tracking-wider flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-brand-terracotta" /> Novo Menu Lateral (Sidebar)
                </h4>
                <p className="text-xs text-brand-charcoal/80 leading-relaxed">
                  Para acomodar o crescimento de funcionalidades do sistema (Agenda, Cupons, Usuários, etc.), o antigo menu superior foi substituído por uma barra lateral fixa e moderna:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-brand-beige">
                    <p className="font-bold text-brand-purple">Desktop (Telas Médias e Grandes)</p>
                    <p className="text-brand-charcoal/70 mt-1">
                      Sidebar fixa à esquerda com ícone e rótulo para cada aba, acesso direto a &ldquo;Ver catálogo&rdquo; e botão &ldquo;Sair&rdquo; no rodapé. Elimina a necessidade de rolar para ver opções.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-brand-beige">
                    <p className="font-bold text-brand-purple">Dispositivos Móveis (Celulares)</p>
                    <p className="text-brand-charcoal/70 mt-1">
                      Menu deslizante (drawer) acionado pelo ícone hambúrguer no topo. Permite navegação rápida com fechamento automático ao clicar em qualquer aba ou no fundo escurecido.
                    </p>
                  </div>
                </div>
              </div>

              {/* Diagrama Visual de Fluxo */}
              <div className="bg-brand-beige-light/60 p-5 rounded-xl border border-brand-beige">
                <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span>🗺️</span> Fluxo de Navegação & Conversão do Cliente
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-white p-3.5 rounded-xl border border-brand-beige shadow-xs">
                    <div className="w-8 h-8 rounded-full bg-brand-purple/10 text-brand-purple font-bold flex items-center justify-center mx-auto mb-2 text-xs">
                      1
                    </div>
                    <p className="text-xs font-bold text-brand-charcoal">Vitrine / Catálogo</p>
                    <p className="text-[11px] text-brand-charcoal/60 mt-1">
                      Cliente escolhe Vivência em Grupo ou Atendimento Individual.
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-brand-beige shadow-xs">
                    <div className="w-8 h-8 rounded-full bg-brand-purple/10 text-brand-purple font-bold flex items-center justify-center mx-auto mb-2 text-xs">
                      2
                    </div>
                    <p className="text-xs font-bold text-brand-charcoal">Escolha de Horário</p>
                    <p className="text-[11px] text-brand-charcoal/60 mt-1">
                      Se for atendimento individual, seleciona dia e hora (Hold de 15 min).
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-brand-beige shadow-xs">
                    <div className="w-8 h-8 rounded-full bg-brand-purple/10 text-brand-purple font-bold flex items-center justify-center mx-auto mb-2 text-xs">
                      3
                    </div>
                    <p className="text-xs font-bold text-brand-charcoal">Checkout Seguro</p>
                    <p className="text-[11px] text-brand-charcoal/60 mt-1">
                      Login/cadastro obrigatório, cupom opcional e pagamento na InfinitePay.
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-brand-beige shadow-xs">
                    <div className="w-8 h-8 rounded-full bg-brand-mint/20 text-brand-mint font-bold flex items-center justify-center mx-auto mb-2 text-xs">
                      ✓
                    </div>
                    <p className="text-xs font-bold text-brand-charcoal">Confirmação & Avisos</p>
                    <p className="text-[11px] text-brand-charcoal/60 mt-1">
                      Status confirmado, e-mails disparados via Hostinger e Toast no Admin.
                    </p>
                  </div>
                </div>
              </div>

              {/* Divisão dos Tipos de Produtos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-brand-terracotta/40 bg-brand-beige-light/40 space-y-2">
                  <h4 className="text-xs font-bold text-brand-terracotta flex items-center gap-1.5">
                    <Users className="w-4 h-4" /> Vivências & Cursos (Em Grupo)
                  </h4>
                  <ul className="text-xs text-brand-charcoal/80 space-y-1 list-disc list-inside">
                    <li>Controle de vagas máximas e preenchidas (ex: 15 vagas).</li>
                    <li>Permite compra direta de ingressos/vagas.</li>
                    <li>Cadastro de participantes beneficiários opcionais.</li>
                    <li>Exibe badge de vagas restantes e &ldquo;Quase Esgotado&rdquo;.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-brand-purple/30 bg-brand-beige-light/40 space-y-2">
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

          {/* SEÇÃO 2: AGENDA & NOTIFICAÇÕES HOSTINGER */}
          {activeSection === "agenda" && (
            <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-brand-charcoal">
                  2. Módulo de Agenda, Validações & E-mail Hostinger
                </h2>
                <p className="text-xs text-brand-charcoal/70 mt-1">
                  Gerenciamento da rotina profissional das facilitadoras/terapeutas, horários de atendimento, bloqueios e alertas de agendamento.
                </p>
              </div>

              {/* Destaque: Máscara e Validação de E-mail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-brand-beige-light/60 border border-brand-beige space-y-2">
                  <h4 className="font-bold text-brand-purple flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-brand-terracotta" /> Máscara Automática de WhatsApp
                  </h4>
                  <p className="text-brand-charcoal/70 leading-relaxed">
                    O campo de telefone da terapeuta formata automaticamente no padrão brasileiro <code>(11) 99999-9999</code> conforme você digita. Isso garante que os links gerados para o WhatsApp abram diretamente a conversa correta no celular ou computador.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-brand-beige-light/60 border border-brand-beige space-y-2">
                  <h4 className="font-bold text-brand-purple flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-brand-terracotta" /> Validação Estrita de E-mail
                  </h4>
                  <p className="text-brand-charcoal/70 leading-relaxed">
                    Para evitar falhas silenciosas na entrega dos avisos, o sistema valida a estrutura do e-mail da terapeuta em tempo real. Se houver erro de digitação, a borda fica vermelha e o botão de salvar/testar é bloqueado preventivamente.
                  </p>
                </div>
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
                    Define quais dias da semana e turnos estão abertos para reservas. O sistema opera com <strong>3 turnos fixos</strong>:
                    <br />• <strong>Manhã:</strong> 09:00 às 12:00
                    <br />• <strong>Tarde:</strong> 13:00 às 15:00
                    <br />• <strong>Noite:</strong> 18:00 às 21:00
                    <br />Por padrão, Segunda a Sexta têm os 3 turnos ativos; Sábado e Domingo ficam inativos. A duração dos slots é definida automaticamente pelo produto selecionado pelo cliente.
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
                    As mensagens são despachadas pelo servidor oficial da Hostinger (<code>smtp.hostinger.com</code>, porta 465 SSL/TLS). Suas credenciais corporativas ficam armazenadas de forma segura no banco de dados e podem ser testadas com um clique.
                  </p>
                </div>
              </div>

              {/* Passo a passo: Como agendar ou alterar */}
              <div className="bg-brand-beige-light p-4 rounded-xl border border-brand-beige text-xs space-y-2">
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
                    3. Na opção <strong>Tipo de Produto</strong>, selecione <strong>Atendimento Terapêutico Individual</strong> (isso ativa a flag <code className="bg-brand-beige px-1 py-0.5 rounded text-brand-purple">atendimento_individual = true</code>).<br />
                    4. Defina o <strong>Tempo de Consulta</strong> (veja abaixo).<br />
                    5. Salve o produto. Na vitrine pública, o botão mudará automaticamente de <em>&ldquo;Inscrever-se&rdquo;</em> para <em>&ldquo;Agendar Sessão&rdquo;</em> e solicitará a escolha de data antes do pagamento.
                  </p>
                </div>

                <div className="border border-brand-purple/30 rounded-xl p-4 space-y-2 bg-brand-beige-light/40">
                  <h4 className="font-bold text-brand-purple flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Tempo de Consulta (campo exclusivo de Atendimento Individual)
                  </h4>
                  <p className="text-brand-charcoal/70 leading-relaxed">
                    Ao marcar &ldquo;Atendimento Terapêutico Individual&rdquo;, aparece o campo <strong>Tempo de Consulta</strong>. Selecione uma das durações pré-definidas ou informe um valor personalizado:
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {["45min", "1h", "1:30hs", "2h", "3h"].map((t) => (
                      <span key={t} className="px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple font-bold text-[11px] border border-brand-purple/20">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="text-brand-charcoal/70 leading-relaxed mt-2">
                    <strong>Padrão:</strong> 1:30hs (90 min — já inclui o intervalo de transição). Este valor controla diretamente quantos horários o sistema gera por turno: por exemplo, com 1:30hs no turno da manhã (09:00–12:00) serão gerados 2 slots (09:00 e 10:30).
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

                <div className="border border-brand-purple/20 bg-brand-beige-light/40 rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-brand-purple flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-brand-terracotta" /> Novo Menu de Compartilhamento de Vivências
                  </h4>
                  <p className="text-brand-charcoal/70 leading-relaxed">
                    Tanto nos cards da vitrine quanto na página de detalhes do produto, há agora um botão elegante de compartilhamento com popover escuro flutuante nos tons oficiais da marca:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-brand-charcoal/80 mt-1">
                    <li><strong>WhatsApp com Prévia:</strong> Abre uma conversa direta com convite acolhedor e link canônico que carrega automaticamente a foto da vivência (OpenGraph).</li>
                    <li><strong>Copiar Link:</strong> Copia o link direto para a área de transferência com confirmação visual imediata na tela (&ldquo;Link copiado!&rdquo; em verde).</li>
                    <li><strong>Mais opções...:</strong> Aciona a folha de compartilhamento nativa do smartphone/tablet (Instagram, Telegram, E-mail) ou abre o cliente de e-mail no computador.</li>
                  </ul>
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

              <div className="p-4 rounded-xl bg-brand-beige-light border border-brand-beige text-xs space-y-2">
                <p className="font-bold text-brand-purple">
                  O que é o Webhook da InfinitePay?
                </p>
                <p className="text-brand-charcoal/70 leading-relaxed">
                  Quando o cliente paga, a InfinitePay envia um sinal criptografado para o endpoint <code className="bg-white px-1 py-0.5 rounded border border-brand-beige text-brand-purple">/api/webhook</code>. O sistema valida a assinatura HMAC, marca o pedido como <strong>pago</strong>, confirma a vaga/agendamento e envia os e-mails automaticamente. Não é necessária intervenção manual para liberar a compra!
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

                <div className="bg-brand-mint/10 p-4 rounded-xl border border-brand-mint/30 space-y-1.5">
                  <p className="font-bold text-brand-mint">Cupom Cortesia (100%)</p>
                  <p className="text-brand-charcoal/70">
                    Cupons de 100% liberam o pedido imediatamente sem passar por cartão ou banco, confirmando a inscrição direto.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SEÇÃO 6: TESTE YIN/YANG & RELATÓRIO PDF */}
          {activeSection === "teste-yin-yang" && (
            <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-terracotta/15 text-xs font-semibold text-brand-terracotta mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Novo Módulo Clínico de Autoconhecimento</span>
                </div>
                <h2 className="text-lg font-bold text-brand-charcoal">
                  6. Avaliações Clínicas (Yin/Yang, Eneagrama & Cronotipo) & Laudos em PDF
                </h2>
                <p className="text-xs text-brand-charcoal/70 mt-1">
                  Módulos de diagnóstico e autoconhecimento integrando a Medicina Tradicional Chinesa (Yin/Yang), o Eneagrama com Constelações Familiares e a Cronobiologia (Ritmo Biológico), com relatórios em PDF formatados para folha A4, compartilhamento e controle administrativo unificado.
                </p>
              </div>

              {/* Card 1: Como Funciona o Teste */}
              <div className="bg-brand-purple/5 border border-brand-purple/20 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-purple text-white flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-brand-beige" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-brand-purple-deep">O Fluxo da Experiência do Usuário</h3>
                    <p className="text-xs text-brand-charcoal/70">Captação ativa de cadastros e triagem diagnóstica terapêutica.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-brand-beige space-y-1">
                    <span className="font-bold text-brand-purple">1. Descoberta</span>
                    <p className="text-brand-charcoal/70">O visitante acessa a seção de testes pela Home (botão <strong>&ldquo;Teste de Autoconhecimento&rdquo;</strong>) e escolhe qual avaliação deseja realizar.</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-brand-beige space-y-1">
                    <span className="font-bold text-brand-purple">2. Login Obrigatório</span>
                    <p className="text-brand-charcoal/70">Para personalizar o laudo, é exigido login ou cadastro rápido gratuito, permitindo que a plataforma armazene os vínculos ao usuário.</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-brand-beige space-y-1">
                    <span className="font-bold text-brand-purple">3. Questionário</span>
                    <p className="text-brand-charcoal/70">O participante responde às questões interativas formatadas de acordo com a lógica do teste escolhido (ex: tendências, reações ou comportamentos).</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-brand-beige space-y-1">
                    <span className="font-bold text-brand-purple">4. Relatório em PDF</span>
                    <p className="text-brand-charcoal/70">O sistema calcula as respostas, exibe o diagnóstico e fornece o documento A4 profissional para download ou impressão.</p>
                  </div>
                </div>
              </div>

              {/* Card de Regras e Banco de Dados */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-900">Configuração de Banco & Laudos Históricos</h3>
                    <p className="text-xs text-emerald-950/70">Padrões obrigatórios no Supabase para correta vinculação dos testes.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-brand-beige space-y-1">
                    <span className="font-bold text-emerald-800 block">Slug Padronizado</span>
                    <p className="text-brand-charcoal/70">Todos os produtos de teste devem possuir <strong>slug = "teste"</strong>. O sistema agrupará as vendas corretamente e redirecionará acessos para o catálogo unificado.</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-brand-beige space-y-1">
                    <span className="font-bold text-emerald-800 block">Rota de Teste Obrigatória</span>
                    <p className="text-brand-charcoal/70">A coluna <strong>rota_teste</strong> (ex: <code className="bg-brand-beige/30 px-1 py-0.5 rounded">/teste-cronotipo</code>) é OBRIGATÓRIA. É por meio dela que a página carrega o preço e o sistema rastreia qual teste exato foi comprado.</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-brand-beige space-y-1">
                    <span className="font-bold text-emerald-800 block">Acesso Histórico</span>
                    <p className="text-brand-charcoal/70">O sistema checa <strong>avaliacoes_...</strong> (ex: avaliacoes_cronotipo). Se o usuário tem 0 créditos mas já respondeu no passado, o PDF é liberado sem nova cobrança.</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Regra Antiempatia e Diagnósticos */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-brand-charcoal/60 uppercase tracking-wider">
                    Padrões Diagnósticos & Regra Estrita de Empate
                  </h3>
                  <span className="text-[11px] font-semibold text-brand-terracotta bg-brand-terracotta/10 px-2.5 py-0.5 rounded-full">
                    Empates Bloqueados
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-orange-50/70 p-4 rounded-xl border border-orange-200 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-orange-900">
                      <Flame className="w-4 h-4 text-orange-600" />
                      <span>Predominância Yang (Calor/Fogo)</span>
                    </div>
                    <p className="text-orange-950/80 leading-relaxed">
                      Sintomas de aceleração mental, calor corporal, agitação e insônia de início (dificuldade de adormecer). Requer resfriamento consciente, alimentos cozidos na água/vapor e chás drenantes (hortelã, camomila, erva-cidreira).
                    </p>
                  </div>

                  <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <Droplets className="w-4 h-4 text-emerald-600" />
                      <span>Predominância Yin (Frio/Recolhimento)</span>
                    </div>
                    <p className="text-emerald-950/80 leading-relaxed">
                      Sensação frequente de frio, extremidades geladas, lentidão matinal e sono pesado com cansaço ao acordar. Requer tonificação do fogo vital com raízes, canela, gengibre, noz-moscada e preparos assados ou ensopados.
                    </p>
                  </div>
                </div>

                {/* Cronotipo Biológico */}
                <div className="pt-2 border-t border-brand-beige">
                  <p className="text-[11px] font-bold text-brand-charcoal/70 uppercase tracking-wider mb-2">
                    Cronobiologia & Perfis Circadianos (Escala de 6 a 18 Pontos)
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                    <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                      <span className="font-bold text-amber-900 block mb-1">Cotovia • Matutino (15-18 pts)</span>
                      <p className="text-amber-950/80 leading-relaxed text-[11px]">
                        Pico cognitivo matutino (08h às 12h), despertar precoce e sono antecipado (21h30). Dificuldade em turnos noturnos.
                      </p>
                    </div>
                    <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
                      <span className="font-bold text-emerald-900 block mb-1">Urso • Intermediário (10-14 pts)</span>
                      <p className="text-emerald-950/80 leading-relaxed text-[11px]">
                        Ritmo da adaptação biológica, distribuição equilibrada de energia e pico entre 10h e 16h. Maior flexibilidade horária.
                      </p>
                    </div>
                    <div className="bg-slate-100/80 p-3 rounded-xl border border-slate-300">
                      <span className="font-bold text-slate-900 block mb-1">Coruja • Vespertino (6-9 pts)</span>
                      <p className="text-slate-950/80 leading-relaxed text-[11px]">
                        Pico de atenção ao entardecer/noite (16h às 22h). Maior vulnerabilidade ao jetlag social e privação crônica de sono matinal.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80 text-xs text-amber-950/85 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-900 font-semibold">Tratamento de Empate Energético no Yin-Yang:</strong> Em caso de equivalência exata de pontuação entre Yang e Yin, o sistema bloqueia automaticamente a emissão de laudo e abre um modal informativo solicitando que o participante retome o teste do início, garantindo rigor e eficácia clínica.
                  </div>
                </div>
              </div>

              {/* Card 3: Recursos Inclusos na Página e no Relatório */}
              <div className="bg-brand-beige-light/40 border border-brand-beige rounded-2xl p-5 space-y-3 text-xs">
                <h3 className="text-sm font-bold text-brand-charcoal flex items-center gap-2">
                  <Printer className="w-4 h-4 text-brand-terracotta" />
                  <span>Conteúdos Clínicos Entregues ao Paciente</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-brand-charcoal/80">
                  <ul className="space-y-1.5 list-disc list-inside">
                    <li><strong>Impacto no Sono (Wei Qi):</strong> Explicação fisiológica clássica do Cânone de Medicina Chinesa sobre como a energia defensiva afeta a qualidade do descanso.</li>
                    <li><strong>Sinais de Alerta:</strong> Prevenção de burnout, hiperacidez, enxaquecas ou fadiga crônica se o padrão não for compensado.</li>
                    <li><strong>Dietoterapia Terapêutica:</strong> Alimentos indicados, especiarias medicinais e o que deve ser evitado ou moderado.</li>
                  </ul>
                  <ul className="space-y-1.5 list-disc list-inside">
                    <li><strong>Fitoterapia & Chás:</strong> Prescrições com modo de preparo correto (infusão vs decocção) e melhores horários de ingestão.</li>
                    <li><strong>Metrônomo Respiratório Interativo:</strong> Widget com animação expansiva em tela guiando a respiração terapêutica (4s/8s ou 4s/2s/4s).</li>
                    <li><strong>Relatório Clínico Formatado (A4):</strong> Emissão com 1 clique com tabela de todas as 15 respostas e cabeçalho oficial do INstituto.</li>
                  </ul>
                </div>
              </div>

              {/* Card 4: Conversão para Vivências e Consultas */}
              <div className="border border-brand-mint/40 bg-brand-mint/10 rounded-xl p-4 text-xs space-y-2">
                <p className="font-bold text-brand-mint">Funil de Conversão Terapêutica & Gestão de Leads no Admin</p>
                <p className="text-brand-charcoal/80 leading-relaxed">
                  Os testes de autoconhecimento (Yin/Yang, Eneagrama e Cronotipo) são portas de entrada estratégicas para novos alunos e pacientes. Ao concluir o teste, o usuário é convidado a participar das vivências semanais de grupo (quintas-feiras às 19:30) ou agendar uma consulta individual com as terapeutas do INstituto.
                </p>
                <p className="text-brand-charcoal/80 leading-relaxed pt-1 border-t border-brand-mint/20">
                  <strong>Aba &ldquo;Avaliações&rdquo; no Painel Admin:</strong> Centraliza todos os diagnósticos gerados com seletor quádruplo (<strong>Todos</strong>, <strong>Yin/Yang</strong>, <strong>Eneagrama</strong> e <strong>Cronotipo</strong>). Disponibiliza métricas gerenciais em tempo real, comparativo de tendências (últimos 7 e 30 dias), identificação de leads únicos e participantes que realizaram múltiplos testes, distribuição por perfis clínicos (Cotovia, Urso e Coruja), botões diretos de contato via WhatsApp com mensagens personalizadas, exportação de relatórios em CSV e botões de compartilhamento rápido em redes sociais.
                </p>
              </div>
            </div>
          )}

          {/* SEÇÃO 7: SEGURANÇA & SENHA */}
          {activeSection === "seguranca" && (
            <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-brand-charcoal">
                  7. Segurança, Senha Mestra & Proteção de Dados
                </h2>
                <p className="text-xs text-brand-charcoal/70 mt-1">
                  Gerenciamento da credencial administrativa, sessões seguras e diretrizes de proteção do sistema.
                </p>
              </div>

              {/* Card 1: Como Alterar a Senha */}
              <div className="bg-brand-purple/5 border border-brand-purple/20 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-purple text-white flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-brand-beige" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-brand-purple-deep">Como Alterar a Senha do Administrador</h3>
                    <p className="text-xs text-brand-charcoal/70">Processo rápido disponível diretamente pelo painel administrativo.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-brand-beige space-y-1">
                    <span className="font-bold text-brand-purple">1. Acesse o Menu</span>
                    <p className="text-brand-charcoal/70">No rodapé da barra lateral esquerda, clique em <strong>Alterar Senha</strong> (ícone de chave).</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-brand-beige space-y-1">
                    <span className="font-bold text-brand-purple">2. Senha Atual</span>
                    <p className="text-brand-charcoal/70">Digite a senha que você utilizou para acessar o painel hoje.</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-brand-beige space-y-1">
                    <span className="font-bold text-brand-purple">3. Nova Senha & Diretrizes</span>
                    <p className="text-brand-charcoal/70">Digite a nova senha atendendo às diretrizes de segurança (mínimo 8 caracteres, maiúsculas, minúsculas, números e caracteres especiais) e confirme.</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-brand-beige space-y-1">
                    <span className="font-bold text-brand-purple">4. Salvar & Renovar</span>
                    <p className="text-brand-charcoal/70">Clique em salvar. Sua sessão é renovada automaticamente e outras sessões são desconectadas.</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Recuperação de Senha do Usuário */}
              <div className="bg-brand-beige-light/40 border border-brand-beige rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-charcoal text-white flex items-center justify-center">
                    <Mail className="w-5 h-5 text-brand-beige" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-brand-charcoal">Recuperação de Senha de Clientes & Terapeutas</h3>
                    <p className="text-xs text-brand-charcoal/70">Autoatendimento autônomo na loja e suporte multicanal no painel admin.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-brand-beige space-y-1.5">
                    <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                      <span>⚡</span> 1. Autoatendimento Autônomo
                    </span>
                    <p className="text-brand-charcoal/70 leading-relaxed">
                      O usuário cadastrado clica em <em>&ldquo;Esqueceu a senha?&rdquo;</em> na tela pública de <strong>/login</strong>. O sistema gera automaticamente um token de segurança de 1 hora e despacha o e-mail via servidor corporativo Hostinger. O cliente revalida seu acesso sozinho, sem depender da administração.
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-brand-beige space-y-1.5">
                    <span className="font-bold text-brand-purple flex items-center gap-1.5">
                      <span>🛠️</span> 2. Suporte Manual no Admin
                    </span>
                    <p className="text-brand-charcoal/70 leading-relaxed">
                      Na aba <strong>Usuários</strong>, o administrador pode clicar em <em>&ldquo;Resetar Senha&rdquo;</em> em qualquer cliente. O modal permite disparar o e-mail oficial com 1 clique e disponibiliza o botão para copiar o link ou enviá-lo diretamente pelo WhatsApp com texto acolhedor.
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-brand-beige space-y-1.5">
                    <span className="font-bold text-brand-terracotta flex items-center gap-1.5">
                      <span>🔒</span> 3. SMTP Hostinger Compartilhado
                    </span>
                    <p className="text-brand-charcoal/70 leading-relaxed">
                      As credenciais corporativas salvas na aba <strong>Agenda &rarr; Configurações</strong> (servidor <code>smtp.hostinger.com:465</code> SSL) são reutilizadas de forma unificada e segura para os e-mails de recuperação de senha e notificações de agendamentos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Como funciona nos bastidores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-brand-beige-light/60 p-4 rounded-xl border border-brand-beige space-y-2">
                  <div className="flex items-center gap-2 text-brand-purple font-bold">
                    <ShieldCheck className="w-4 h-4 text-brand-mint" />
                    <span>Criptografia scrypt + Salt no Supabase</span>
                  </div>
                  <p className="text-brand-charcoal/70 leading-relaxed">
                    A sua senha nunca é gravada em texto puro. O sistema gera um hash criptográfico com <strong>scrypt e salt único</strong> armazenado de forma privada no Supabase, protegido por políticas estritas de RLS (acessível exclusivamente pelo backend via service_role).
                  </p>
                </div>

                <div className="bg-brand-beige-light/60 p-4 rounded-xl border border-brand-beige space-y-2">
                  <div className="flex items-center gap-2 text-brand-purple font-bold">
                    <Zap className="w-4 h-4 text-brand-terracotta" />
                    <span>Invalidação Imediata de Outras Sessões</span>
                  </div>
                  <p className="text-brand-charcoal/70 leading-relaxed">
                    Se outro computador ou navegador estiver conectado ao painel com a senha anterior, a sessão dele é invalidada automaticamente no instante da troca. Apenas o seu navegador ativo recebe o novo cookie de autorização.
                  </p>
                </div>
              </div>

              {/* Card 3: Boas Práticas e Recomendações */}
              <div className="border border-brand-beige rounded-xl p-4 bg-white space-y-2 text-xs">
                <h4 className="font-bold text-brand-charcoal flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-brand-terracotta" />
                  <span>Recomendações Importantes de Segurança</span>
                </h4>
                <ul className="list-disc list-inside text-brand-charcoal/70 space-y-1">
                  <li>Troque a senha periodicamente ou sempre que houver mudança na equipe com acesso de gestão.</li>
                  <li>Evite reutilizar senhas pessoais ou combinações simples como datas de aniversário.</li>
                  <li>Em caso de emergência ou esquecimento da senha, o acesso mestre pode ser restaurado via console Supabase ou redefinindo a variável no Vercel.</li>
                </ul>
              </div>
            </div>
          )}

          {/* SEÇÃO 8: FAQ */}
          {activeSection === "faq" && (
            <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-brand-charcoal">
                  8. Dúvidas Frequentes & Procedimentos Administrativos
                </h2>
                <p className="text-xs text-brand-charcoal/70 mt-1">
                  Respostas rápidas para situações rotineiras de atendimento ao cliente e gestão de acesso.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    q: "Quais testes de Autoconhecimento estão disponíveis na plataforma?",
                    a: "Atualmente a plataforma oferece três testes: o Teste Yin/Yang (Medicina Tradicional Chinesa), o Teste de Eneagrama (mapeamento de personalidade em 9 tipos) e o Teste de Lealdades Invisíveis (Constelações Familiares). Todos exigem que o cliente esteja cadastrado/logado.",
                  },
                  {
                    q: "Como o participante salva ou imprime o laudo em PDF dos testes?",
                    a: "Na tela de resultado final, o usuário encontra o botão 'Visualizar & Imprimir Relatório em PDF'. O sistema abrirá um layout especial adaptado (em A4) com cabeçalhos oficiais do Instituto Kalapa, dados do paciente e todo o conteúdo do laudo, pronto para ser salvo em PDF ou impresso diretamente pelo navegador.",
                  },
                  {
                    q: "Como funciona a recuperação de senha quando o cliente esquece?",
                    a: "O cliente pode solicitar autonomamente na tela de /login clicando em 'Esqueceu a senha?'. O sistema despacha um e-mail com token seguro de 1 hora via SMTP Hostinger. Alternativamente, o administrador pode entrar na aba 'Usuários', clicar em 'Resetar Senha' e enviar pelo WhatsApp ou e-mail com 1 clique.",
                  },
                  {
                    q: "Como faço para alterar a senha do painel administrativo?",
                    a: "No rodapé do menu lateral à esquerda, clique no botão 'Alterar Senha'. Digite sua senha atual, escolha a nova senha (mínimo de 8 caracteres) e confirme. Ao salvar, sua sessão continua conectada e todos os outros computadores precisarão digitar a nova senha.",
                  },
                  {
                    q: "O que acontece se eu esquecer a senha atual do painel de administração?",
                    a: "Por motivos de segurança, a senha é armazenada como hash criptográfico não reversível. Caso a senha seja esquecida, o desenvolvedor ou responsável pela infraestrutura técnica pode restaurar a credencial pelo Supabase (tabela configuracoes) ou pela variável ADMIN_PASSWORD na Vercel.",
                  },
                  {
                    q: "Um cliente pediu para cancelar ou reagendar a sessão. O que devo fazer?",
                    a: "Acesse a aba '🗓️ Agenda & Atendimentos', localize a consulta do paciente e clique no botão 'Cancelar Consulta'. O sistema solicitará uma justificativa obrigatória por escrito, liberará o horário na grade para outros pacientes e registrará a ocorrência na auditoria.",
                  },
                  {
                    q: "O cliente pagou no PIX mas diz que não recebeu e-mail. Como verificar?",
                    a: "Acesse a aba 'Pedidos' e busque pelo nome ou e-mail do cliente. Se o status estiver 'pago', o agendamento foi confirmado. Lembre-se de orientar o cliente a checar a caixa de Spam/Promoções. As mensagens partem da conta oficial cadastrada no SMTP Hostinger.",
                  },
                  {
                    q: "Como alterar a facilitadora/terapeuta que recebe as notificações?",
                    a: "Na aba 'Agenda & Atendimentos', clique na sub-aba 'Configurações & Notificações'. Digite o novo endereço de e-mail e telefone, e clique em 'Salvar Configurações'. Você pode clicar em 'Enviar E-mail de Teste' para se certificar de que está recebendo na caixa postal correta.",
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

          {/* SEÇÃO 9: CHANGELOG & VERSÕES */}
          {activeSection === "changelog" && (
            <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-brand-beige">
                <div>
                  <h2 className="text-lg font-bold text-brand-charcoal">
                    9. Versões do Sistema & Notas de Atualização
                  </h2>
                  <p className="text-xs text-brand-charcoal/70 mt-1">
                    Mecanismo dinâmico de documentação: sempre que houver novas melhorias ou correções, este histórico é atualizado para manter a equipe informada.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple font-mono font-bold text-xs">
                  Versão Atual: v2.11.0
                </div>
              </div>

              <div className="space-y-4">
                {/* v2.11.0 */}
                <div className="relative pl-6 border-l-2 border-brand-purple space-y-1.5">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-brand-purple" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-brand-purple">v2.11.0</span>
                    <span className="text-[10px] text-brand-charcoal/50">Outubro / 2026</span>
                  </div>
                  <h4 className="font-bold text-xs text-brand-charcoal">
                    Expansão do Módulo de Autoavaliações
                  </h4>
                  <ul className="text-xs text-brand-charcoal/70 list-disc list-inside space-y-0.5 mb-4">
                    <li><strong>Teste de Lealdades Invisíveis:</strong> Implementação do teste baseado em Constelações Familiares com mapa de diagnóstico, impressão em PDF (A4) contendo biografia de Bert Hellinger e leis sistêmicas.</li>
                    <li><strong>Teste de Eneagrama:</strong> Mapeamento dos 9 tipos de personalidade com detalhamento profundo (motivação, virtudes, vícios) e visualização com PDF em A4.</li>
                    <li><strong>Correção de Acompanhantes:</strong> Refatoração do fluxo de check-out para criar corretamente as inscrições de convidados e atualização do Admin para não sobrescrever os nomes dos acompanhantes na edição manual.</li>
                  </ul>
                  
                  <h4 className="text-sm font-bold text-brand-purple mt-4 mb-2">
                    Módulo de Autoavaliação Yin/Yang (MTC) & Emissão de Relatório Clínico A4
                  </h4>
                  <ul className="text-xs text-brand-charcoal/70 list-disc list-inside space-y-0.5">
                    <li>Novo botão de ação rápida <strong>&ldquo;Teste de Autoconhecimento&rdquo;</strong> ao lado de Calendário na Hero da Home e no menu superior.</li>
                    <li>Questionário clínico interativo com as 15 dimensões fisiológicas e comportamentais do Cânone do Imperador Amarelo (MTC).</li>
                    <li>Exigência amigável de login ou cadastro prévio, ampliando a base de clientes do INstituto com redirecionamento automático.</li>
                    <li>Diagnóstico trifásico (Predominância Yang, Predominância Yin e Equilíbrio) com prescrições de sono, dietoterapia e chás.</li>
                    <li>Metrônomo visual interativo para guia de respiração terapêutica com tempos de expansão e ancoragem.</li>
                    <li>Emissão com 1 clique de <strong>Relatório Clínico em PDF (formato A4)</strong> para consulta ou impressão pelo paciente.</li>
                    <li>Fotografias editoriais em estilo zen contemporâneo geradas por inteligência artificial e harmonizadas com a paleta Kalapa.</li>
                    <li>Suporte a e-mail multipart (HTML + Texto Puro) no módulo de recuperação de senha para máxima compatibilidade anti-spam.</li>
                  </ul>
                </div>

                {/* v2.10.0 */}
                <div className="relative pl-6 border-l-2 border-brand-beige space-y-1.5">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-brand-beige" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-brand-charcoal/70">v2.10.0</span>
                    <span className="text-[10px] text-brand-charcoal/50">Outubro / 2026</span>
                  </div>
                  <h4 className="font-bold text-xs text-brand-charcoal">
                    Ativação do Módulo de Recuperação de Senha & Suporte Multicanal
                  </h4>
                  <ul className="text-xs text-brand-charcoal/70 list-disc list-inside space-y-0.5">
                    <li>Autoatendimento autônomo completo na tela pública de <strong>/login</strong> (modal com despacho instantâneo via SMTP Hostinger).</li>
                    <li>Novo endpoint administrativo com geração de token seguro de 1 hora e despacho de e-mail institucional padronizado.</li>
                    <li>Ação rápida na aba <strong>Usuários</strong> e no modal de detalhes com botão para cópia de link seguro e envio com 1 clique para WhatsApp.</li>
                    <li>Reutilização integrada das credenciais SMTP corporativas da Hostinger salvas no banco de dados.</li>
                    <li>Detecção dinâmica de domínio base para garantir que os links de redefinição funcionem em qualquer ambiente.</li>
                  </ul>
                </div>

                {/* v2.9.0 */}
                <div className="relative pl-6 border-l-2 border-brand-beige space-y-1.5">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-brand-beige" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-brand-charcoal/70">v2.9.0</span>
                    <span className="text-[10px] text-brand-charcoal/50">Outubro / 2026</span>
                  </div>
                  <h4 className="font-bold text-xs text-brand-charcoal">
                    Menu Popover de Compartilhamento & Harmonização com a Paleta Oficial
                  </h4>
                  <ul className="text-xs text-brand-charcoal/70 list-disc list-inside space-y-0.5">
                    <li>Novo botão disparador circular e popover escuro translúcido com cantos arredondados nos cards e página de detalhes.</li>
                    <li>Compartilhamento direto via WhatsApp com convite acolhedor e prévia automática de foto/título (OpenGraph).</li>
                    <li>Opção Copiar Link com feedback em tempo real na própria linha (&ldquo;Link copiado!&rdquo; em tom verde).</li>
                    <li>Opção Mais opções com disparo nativo do sistema operacional (<code>navigator.share</code>) e fallback para e-mail no desktop.</li>
                    <li>Harmonização visual completa com a paleta oficial da marca Kalapa (Deep Ocean <code>#0D1E28</code>, Terracotta/Dourado <code>#B8965A</code> e Menta/Sage <code>#7D8C6E</code>).</li>
                  </ul>
                </div>

                {/* v2.8.0 */}
                <div className="relative pl-6 border-l-2 border-brand-beige space-y-1.5">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-brand-beige" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-brand-charcoal/70">v2.8.0</span>
                    <span className="text-[10px] text-brand-charcoal/50">Setembro / 2026</span>
                  </div>
                  <h4 className="font-bold text-xs text-brand-charcoal">
                    Módulo de Troca de Senha do Admin & Hardening de Cibersegurança
                  </h4>
                  <ul className="text-xs text-brand-charcoal/70 list-disc list-inside space-y-0.5">
                    <li>Novo botão <strong>Alterar Senha</strong> no rodapé da barra lateral com modal seguro e validação de senha atual.</li>
                    <li>Armazenamento criptografado via hash <strong>scrypt + salt</strong> na tabela de configurações do Supabase.</li>
                    <li>Renovação automática e transparente de sessão ativa, com revogação instantânea de sessões em outros navegadores.</li>
                    <li>Hardening completo de políticas RLS do Supabase, isolando dados pessoais e notas terapêuticas contra extração via chave anônima.</li>
                    <li>Rate limiting nas rotas de autenticação e proteção contra vazamento público de credenciais SMTP.</li>
                  </ul>
                </div>

                {/* v2.7.0 */}
                <div className="relative pl-6 border-l-2 border-brand-beige space-y-1.5">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-brand-beige" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-brand-charcoal/70">v2.7.0</span>
                    <span className="text-[10px] text-brand-charcoal/50">Setembro / 2026</span>
                  </div>
                  <h4 className="font-bold text-xs text-brand-charcoal">
                    Tempo de Consulta por Produto & 3 Turnos no Calendário (Manhã / Tarde / Noite)
                  </h4>
                  <ul className="text-xs text-brand-charcoal/70 list-disc list-inside space-y-0.5">
                    <li>Novo campo <strong>Tempo de Consulta</strong> nos produtos de Atendimento Individual (45min, 1h, 1:30hs, 2h, 3h ou valor personalizado).</li>
                    <li>Padrão de 1:30hs (90 min) que já inclui o intervalo de transição entre sessões.</li>
                    <li>Badge de duração exibido na listagem de produtos do painel admin.</li>
                    <li>Grade semanal expandida para <strong>3 turnos independentes</strong>: Manhã (09:00–12:00), Tarde (13:00–15:00) e Noite (18:00–21:00).</li>
                    <li>Slots do calendário do cliente calculados dinamicamente pela duração do produto selecionado.</li>
                    <li>Padrão: Segunda a Sexta com os 3 turnos ativos; Sábado e Domingo inativos (editáveis).</li>
                  </ul>
                </div>

                {/* v2.6.0 */}
                <div className="relative pl-6 border-l-2 border-brand-beige space-y-1.5">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-brand-beige" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-brand-charcoal/70">v2.6.0</span>
                    <span className="text-[10px] text-brand-charcoal/50">Setembro / 2026</span>
                  </div>
                  <h4 className="font-bold text-xs text-brand-charcoal">
                    Novo Menu Lateral (Sidebar), SMTP Hostinger & Validações de Contato
                  </h4>
                  <ul className="text-xs text-brand-charcoal/70 list-disc list-inside space-y-0.5">
                    <li>Menu lateral desktop fixo e drawer retrátil mobile substituindo abas horizontais do topo.</li>
                    <li>Integração com servidor SMTP corporativo Hostinger (<code>smtp.hostinger.com:465</code> SSL).</li>
                    <li>Máscara automática para telefone celular / WhatsApp <code>(11) 99999-9999</code> no painel.</li>
                    <li>Validação estrita de e-mail de terapeuta para prevenir falhas de digitação e entrega.</li>
                    <li>Atualização completa do Manual do Sistema alinhado à paleta oficial da identidade visual.</li>
                  </ul>
                </div>

                {/* v2.5.0 */}
                <div className="relative pl-6 border-l-2 border-brand-beige space-y-1.5">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-brand-beige" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-brand-charcoal/70">v2.5.0</span>
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

                {/* v2.4.0 */}
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
                    <li>Flag de produto <code className="bg-brand-beige px-1 py-0.5 rounded text-brand-purple">atendimento_individual</code> no cadastro de produtos.</li>
                    <li>Grade semanal de horários com janelas da manhã e tarde, duração de 50 min e buffer de 10 min.</li>
                    <li>Bloqueios manuais de data e horário com motivo opcional.</li>
                    <li>Fluxo de reserva obrigatória na vitrine com Hold de 15 minutos e vínculo ao pedido da InfinitePay.</li>
                  </ul>
                </div>

                {/* v2.3.0 */}
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
