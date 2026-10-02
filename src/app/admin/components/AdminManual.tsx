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
  KeyRound,
  Share2,
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
      id: "seguranca",
      title: "6. Segurança & Senha do Painel",
      icon: ShieldCheck,
      summary: "Troca dinâmica de senha do Admin, proteção RLS, sessões seguras e boas práticas.",
      badge: "Novo",
    },
    {
      id: "faq",
      title: "7. Dúvidas Frequentes & Resolução",
      icon: HelpCircle,
      summary: "Perguntas operacionais do dia a dia e procedimentos recomendados.",
    },
    {
      id: "changelog",
      title: "8. Histórico & Versões do Sistema",
      icon: Zap,
      summary: "Registro de atualizações contínuas e notas de versão do projeto.",
      badge: "v2.9",
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

          {/* SEÇÃO 6: SEGURANÇA & SENHA */}
          {activeSection === "seguranca" && (
            <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-brand-charcoal">
                  6. Segurança, Senha Mestra & Proteção de Dados
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

          {/* SEÇÃO 7: FAQ */}
          {activeSection === "faq" && (
            <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-brand-charcoal">
                  7. Dúvidas Frequentes & Procedimentos Administrativos
                </h2>
                <p className="text-xs text-brand-charcoal/70 mt-1">
                  Respostas rápidas para situações rotineiras de atendimento ao cliente e gestão de acesso.
                </p>
              </div>

              <div className="space-y-3">
                {[
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

          {/* SEÇÃO 8: CHANGELOG & VERSÕES */}
          {activeSection === "changelog" && (
            <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-brand-beige">
                <div>
                  <h2 className="text-lg font-bold text-brand-charcoal">
                    8. Versões do Sistema & Notas de Atualização
                  </h2>
                  <p className="text-xs text-brand-charcoal/70 mt-1">
                    Mecanismo dinâmico de documentação: sempre que houver novas melhorias ou correções, este histórico é atualizado para manter a equipe informada.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple font-mono font-bold text-xs">
                  Versão Atual: v2.9.0
                </div>
              </div>

              <div className="space-y-4">
                {/* v2.9.0 */}
                <div className="relative pl-6 border-l-2 border-brand-purple space-y-1.5">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-brand-purple" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-brand-purple">v2.9.0</span>
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
