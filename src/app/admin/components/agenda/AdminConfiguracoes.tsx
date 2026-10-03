"use client";

import { useState, useEffect, useCallback } from "react";
import { Server, User, Mail, Send, Save, Eye, EyeOff, Lock } from "lucide-react";
import type { Therapist } from "@/lib/types";

export default function AdminConfiguracoes({
  setError,
  setSucesso,
}: {
  setError: (msg: string) => void;
  setSucesso: (msg: string) => void;
}) {
  const [loading, setLoading] = useState(true);

  // Terapeutas & Notificação State
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [selectedTherapistId, setSelectedTherapistId] = useState<string>("");
  const [therapistEmail, setTherapistEmail] = useState<string>("");
  const [therapistTelefone, setTherapistTelefone] = useState<string>("");
  const [salvandoConfigTerapeuta, setSalvandoConfigTerapeuta] = useState(false);
  const [testandoEmail, setTestandoEmail] = useState(false);

  // SMTP Hostinger State
  const [smtpHost, setSmtpHost] = useState("smtp.hostinger.com");
  const [smtpPort, setSmtpPort] = useState("465");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpFromName, setSmtpFromName] = useState("INstituto Kalapa");
  const [mostrarSenhaSmtp, setMostrarSenhaSmtp] = useState(false);
  const [salvandoSmtp, setSalvandoSmtp] = useState(false);

  const fetchTherapists = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/agendamentos/therapists");
      if (res.ok) {
        const data = await res.json();
        const list: Therapist[] = data.therapists || [];
        setTherapists(list);
        if (list.length > 0) {
          const primeiro = list[0];
          setSelectedTherapistId(primeiro.id);
          setTherapistEmail(primeiro.email || "");
          setTherapistTelefone(primeiro.telefone || "");
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const fetchSmtp = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/config/smtp");
      if (res.ok) {
        const data = await res.json();
        if (data.smtp) {
          setSmtpHost(data.smtp.host || "smtp.hostinger.com");
          setSmtpPort(data.smtp.port || "465");
          setSmtpUser(data.smtp.user || "");
          setSmtpPass(data.smtp.pass || "");
          setSmtpFromName(data.smtp.fromName || "INstituto Kalapa");
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchTherapists(), fetchSmtp()]);
      setLoading(false);
    };
    loadAll();
  }, [fetchTherapists, fetchSmtp]);

  const handleSalvarSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoSmtp(true);
    setError("");
    setSucesso("");

    try {
      const res = await fetch("/api/admin/config/smtp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: smtpHost,
          port: smtpPort,
          user: smtpUser,
          pass: smtpPass,
          fromName: smtpFromName,
        }),
      });

      if (res.ok) {
        setSucesso("Configurações do SMTP da Hostinger salvas com sucesso no banco de dados!");
        await fetchSmtp();
      } else {
        const d = await res.json();
        setError(d.error || "Erro ao salvar credenciais SMTP.");
      }
    } catch {
      setError("Falha de conexão ao salvar SMTP.");
    }
    setSalvandoSmtp(false);
  };

  const handleSalvarConfigTerapeuta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTherapistId) return;

    setSalvandoConfigTerapeuta(true);
    setError("");
    setSucesso("");

    try {
      const res = await fetch("/api/admin/agendamentos/therapists", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedTherapistId,
          email: therapistEmail,
          telefone: therapistTelefone,
        }),
      });

      if (res.ok) {
        setSucesso("E-mail de notificação e dados do terapeuta salvos com sucesso!");
        await fetchTherapists();
      } else {
        const d = await res.json();
        setError(d.error || "Erro ao salvar dados do terapeuta.");
      }
    } catch {
      setError("Falha de conexão ao salvar configurações.");
    }
    setSalvandoConfigTerapeuta(false);
  };

  const handleTestarEnvioEmail = async () => {
    if (!therapistEmail || !therapistEmail.includes("@")) {
      setError("Informe um e-mail válido para testar o envio de notificação.");
      return;
    }

    setTestandoEmail(true);
    setError("");
    setSucesso("");

    try {
      const res = await fetch("/api/admin/agendamentos/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: therapistEmail,
          terapeuta_id: selectedTherapistId,
        }),
      });

      if (res.ok) {
        setSucesso(`E-mail de teste enviado com sucesso para ${therapistEmail}!`);
      } else {
        const d = await res.json();
        setError(d.error || "Erro ao disparar e-mail de teste.");
      }
    } catch {
      setError("Falha de conexão ao disparar e-mail de teste.");
    }
    setTestandoEmail(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-brand-beige">
        <div className="w-8 h-8 border-3 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-brand-charcoal/60">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Coluna 1: SMTP Hostinger */}
      <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6">
        <div>
          <h3 className="font-bold text-brand-charcoal flex items-center gap-2">
            <Server className="w-4 h-4 text-brand-charcoal" />
            Configurações de Servidor de E-mail (SMTP)
          </h3>
          <p className="text-xs text-brand-charcoal/60 mt-1">
            Configure as credenciais do seu e-mail profissional (Hostinger) para o sistema enviar e-mails de notificação de novos agendamentos sem depender do Resend.
          </p>
        </div>

        <form onSubmit={handleSalvarSmtp} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-charcoal mb-1">Host SMTP</label>
              <input
                type="text"
                required
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                placeholder="ex: smtp.hostinger.com"
                className="w-full bg-brand-beige-light border border-brand-beige rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:ring-2 focus:ring-brand-purple outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-charcoal mb-1">Porta SMTP</label>
              <input
                type="text"
                required
                value={smtpPort}
                onChange={(e) => setSmtpPort(e.target.value)}
                placeholder="ex: 465"
                className="w-full bg-brand-beige-light border border-brand-beige rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:ring-2 focus:ring-brand-purple outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-charcoal mb-1">E-mail Remetente (Usuário)</label>
            <input
              type="email"
              required
              value={smtpUser}
              onChange={(e) => setSmtpUser(e.target.value)}
              placeholder="ex: atendimento@institutokalapa.com.br"
              className="w-full bg-brand-beige-light border border-brand-beige rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:ring-2 focus:ring-brand-purple outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-charcoal mb-1">Senha do E-mail</label>
            <div className="relative">
              <input
                type={mostrarSenhaSmtp ? "text" : "password"}
                required
                value={smtpPass}
                onChange={(e) => setSmtpPass(e.target.value)}
                placeholder="Senha do webmail"
                className="w-full bg-brand-beige-light border border-brand-beige rounded-xl px-3 py-2 pr-10 text-xs text-brand-charcoal focus:ring-2 focus:ring-brand-purple outline-hidden font-mono"
              />
              <button
                type="button"
                onClick={() => setMostrarSenhaSmtp(!mostrarSenhaSmtp)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-charcoal/40 hover:text-brand-charcoal"
              >
                {mostrarSenhaSmtp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-charcoal mb-1">Nome do Remetente</label>
            <input
              type="text"
              required
              value={smtpFromName}
              onChange={(e) => setSmtpFromName(e.target.value)}
              placeholder="ex: INstituto Kalapa"
              className="w-full bg-brand-beige-light border border-brand-beige rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:ring-2 focus:ring-brand-purple outline-hidden"
            />
          </div>

          <div className="pt-2 border-t border-brand-beige/50">
            <button
              type="submit"
              disabled={salvandoSmtp}
              className="w-full bg-brand-charcoal hover:bg-black text-white px-4 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs font-bold"
            >
              {salvandoSmtp ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Salvar Credenciais SMTP
            </button>
          </div>
        </form>
      </div>

      {/* Coluna 2: Notificações do Terapeuta */}
      <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6">
        <div>
          <h3 className="font-bold text-brand-charcoal flex items-center gap-2">
            <User className="w-4 h-4 text-brand-purple" />
            Notificações do Terapeuta
          </h3>
          <p className="text-xs text-brand-charcoal/60 mt-1">
            Configure para qual e-mail as notificações de novos agendamentos serão enviadas, e teste o envio.
          </p>
        </div>

        <div className="bg-brand-beige-light rounded-xl p-4 border border-brand-beige space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-charcoal mb-1">Selecione o Terapeuta (Agenda)</label>
            <select
              value={selectedTherapistId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedTherapistId(id);
                const t = therapists.find((x) => x.id === id);
                if (t) {
                  setTherapistEmail(t.email || "");
                  setTherapistTelefone(t.telefone || "");
                }
              }}
              className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:ring-2 focus:ring-brand-purple outline-hidden"
            >
              {therapists.map((t) => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSalvarConfigTerapeuta} className="space-y-4 pt-2 border-t border-brand-beige/50">
            <div>
              <label className="block text-xs font-semibold text-brand-charcoal mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                E-mail para Receber Notificações
              </label>
              <input
                type="email"
                required
                value={therapistEmail}
                onChange={(e) => setTherapistEmail(e.target.value)}
                placeholder="E-mail que vai receber os avisos"
                className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:ring-2 focus:ring-brand-purple outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={salvandoConfigTerapeuta || !selectedTherapistId}
              className="w-full bg-brand-purple hover:bg-brand-charcoal text-white px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs font-bold"
            >
              {salvandoConfigTerapeuta ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Atualizar E-mail do Terapeuta
            </button>
          </form>
        </div>

        {/* Disparar E-mail de Teste */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
          <h4 className="text-xs font-bold text-blue-900 mb-2 flex items-center gap-1.5">
            <Send className="w-4 h-4" /> Disparar E-mail de Teste
          </h4>
          <p className="text-[10px] text-blue-700/80 mb-4">
            Após configurar o SMTP e o e-mail do terapeuta, você pode disparar um e-mail de teste para verificar se as configurações estão funcionando. O e-mail será enviado para: <strong className="text-blue-900">{therapistEmail || "Nenhum e-mail definido"}</strong>.
          </p>

          <button
            onClick={handleTestarEnvioEmail}
            disabled={testandoEmail || !therapistEmail}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testandoEmail ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Enviar E-mail de Teste Agora
          </button>
        </div>
      </div>
    </div>
  );
}
