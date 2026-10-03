"use client";

import { useState } from "react";
import { Mail, Copy, Check, MessageCircle, ExternalLink, KeyRound, CheckCircle2 } from "lucide-react";
import type { Pedido, Usuario } from "@/lib/types";
import { formatDate, formatCPF } from "../lib/format";

type Props = {
  usuarios: Usuario[];
  usuariosPage: number;
  usuariosTotalPages: number;
  usuariosTotal: number;
  usuariosSearch: string;
  setUsuariosSearch: (value: string) => void;
  fetchUsuarios: (page?: number) => Promise<void>;
  onError: (message: string) => void;
};

export default function AdminUsuarios({
  usuarios,
  usuariosPage,
  usuariosTotalPages,
  usuariosTotal,
  usuariosSearch,
  setUsuariosSearch,
  fetchUsuarios,
  onError,
}: Props) {
  const setError = onError;
  const [usuarioDetalhes, setUsuarioDetalhes] = useState<{ usuario: Usuario; pedidos: Pedido[]; produtos_comprados?: { nome: string; quantidade: number }[] } | null>(null);
  const [usuarioParaReset, setUsuarioParaReset] = useState<Usuario | null>(null);
  const [novaSenhaInput, setNovaSenhaInput] = useState("");
  const [resetandoSenha, setResetandoSenha] = useState(false);
  const [resetSenhaSucesso, setResetSenhaSucesso] = useState("");
  const [enviandoLinkAdmin, setEnviandoLinkAdmin] = useState(false);
  const [linkAdminSucesso, setLinkAdminSucesso] = useState("");
  const [linkAdminGerado, setLinkAdminGerado] = useState("");
  const [copiadoLinkAdmin, setCopiadoLinkAdmin] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<Usuario | null>(null);
  const [excluindoUsuario, setExcluindoUsuario] = useState(false);

  const handleVerDetalhesUsuario = async (u: Usuario) => {
    const res = await fetch(`/api/admin/usuarios/${u.id}`);
    if (res.ok) {
      setUsuarioDetalhes(await res.json());
    }
  };

  const handleResetarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioParaReset || !novaSenhaInput) return;
    setResetandoSenha(true);
    const res = await fetch(`/api/admin/usuarios/${usuarioParaReset.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nova_senha: novaSenhaInput }),
    });
    if (res.ok) {
      setResetSenhaSucesso("Senha redefinida com sucesso!");
      setTimeout(() => {
        setResetSenhaSucesso("");
        setUsuarioParaReset(null);
        setNovaSenhaInput("");
      }, 2000);
    } else {
      const d = await res.json();
      setError(d.error || "Erro ao redefinir senha");
    }
    setResetandoSenha(false);
  };

  const handleEnviarLinkResetAdmin = async () => {
    if (!usuarioParaReset?.id) return;
    setEnviandoLinkAdmin(true);
    setError("");
    setLinkAdminSucesso("");
    setLinkAdminGerado("");
    setCopiadoLinkAdmin(false);
    try {
      const res = await fetch(`/api/admin/usuarios/${usuarioParaReset.id}/reset-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const d = await res.json();
      if (res.ok && d.success) {
        setLinkAdminSucesso(d.message || "Link de recuperação gerado!");
        if (d.resetLink) {
          setLinkAdminGerado(d.resetLink);
        }
      } else {
        setError(d.error || "Erro ao processar recuperação de senha");
      }
    } catch {
      setError("Erro de rede ao enviar link");
    } finally {
      setEnviandoLinkAdmin(false);
    }
  };

  const handleExcluirUsuario = async () => {
    if (!usuarioParaExcluir) return;
    setExcluindoUsuario(true);
    const res = await fetch(`/api/admin/usuarios/${usuarioParaExcluir.id}`, { method: "DELETE" });
    if (res.ok) {
      setUsuarioParaExcluir(null);
      await fetchUsuarios();
    } else {
      const d = await res.json();
      setError(d.error || "Erro ao excluir usuário");
    }
    setExcluindoUsuario(false);
  };

  return (
    <>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-base font-semibold text-brand-charcoal">Usuários / Clientes</h2>
                <p className="text-xs text-brand-charcoal/50">Clientes cadastrados no sistema com dados de acesso e entrega</p>
              </div>

              {/* Busca */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={usuariosSearch}
                  onChange={(e) => setUsuariosSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") fetchUsuarios(1); }}
                  placeholder="Buscar por nome, e-mail ou CPF..."
                  className="px-3.5 py-2 text-xs border border-brand-beige rounded-lg bg-white w-64 focus-visible:border-brand-purple outline-none"
                />
                <button
                  onClick={() => fetchUsuarios(1)}
                  className="px-3 py-2 bg-brand-purple text-white text-xs font-medium rounded-lg hover:bg-brand-purple-dark transition-colors"
                >
                  Buscar
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-brand-beige overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-brand-beige-light border-b border-brand-beige text-xs font-semibold text-brand-charcoal/70 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Cliente</th>
                      <th className="px-4 py-3">Contato</th>
                      <th className="px-4 py-3">Cidade / UF</th>
                      <th className="px-4 py-3 text-center">Pedidos</th>
                      <th className="px-4 py-3">Produtos Comprados</th>
                      <th className="px-4 py-3">Cadastro</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-beige">
                    {usuarios.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-brand-charcoal/50 text-sm">
                          Nenhum usuário encontrado.
                        </td>
                      </tr>
                    ) : (
                      usuarios.map((u) => (
                        <tr key={u.id} className="hover:bg-brand-beige-light/40 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-brand-charcoal text-sm">{u.nome}</p>
                            <p className="text-xs text-brand-charcoal/40 font-mono">CPF: {u.cpf}</p>
                          </td>
                          <td className="px-4 py-3 text-xs">
                            <p className="text-brand-purple font-medium">{u.email}</p>
                            <p className="text-brand-charcoal/60">{u.telefone}</p>
                          </td>
                          <td className="px-4 py-3 text-xs text-brand-charcoal/70">
                            <p>{u.cidade} - {u.uf}</p>
                            <p className="text-brand-charcoal/40 font-mono">CEP {u.cep}</p>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-beige text-brand-charcoal">
                              {u.total_pedidos || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs">
                            {u.produtos_comprados && u.produtos_comprados.length > 0 ? (
                              <div className="flex flex-col gap-1 max-w-[220px]">
                                {u.produtos_comprados.map((prod: { nome: string; quantidade: number }, i: number) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-brand-beige text-brand-charcoal text-[11px] font-medium truncate"
                                    title={`${prod.quantidade}× ${prod.nome}`}
                                  >
                                    <span className="font-bold text-brand-purple">{prod.quantidade}×</span>
                                    <span className="truncate">{prod.nome}</span>
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-brand-charcoal/40 italic">Nenhum</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-brand-charcoal/50">
                            {formatDate(u.created_at)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleVerDetalhesUsuario(u)}
                                className="px-2.5 py-1 text-xs border border-brand-beige rounded-lg hover:bg-brand-beige text-brand-charcoal transition-colors"
                              >
                                Ver Detalhes
                              </button>
                              <button
                                onClick={() => {
                                  setUsuarioParaReset(u);
                                  setNovaSenhaInput("");
                                  setResetSenhaSucesso("");
                                  setLinkAdminSucesso("");
                                  setLinkAdminGerado("");
                                  setCopiadoLinkAdmin(false);
                                }}
                                className="px-2.5 py-1 text-xs border border-brand-purple/30 text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors cursor-pointer"
                              >
                                Resetar Senha
                              </button>
                              <button
                                onClick={() => setUsuarioParaExcluir(u)}
                                className="px-2.5 py-1 text-xs border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Paginação */}
            {usuariosTotalPages > 1 && (
              <div className="flex items-center justify-between mt-4 text-sm">
                <span className="text-brand-charcoal/50">
                  {usuariosTotal} usuários — página {usuariosPage} de {usuariosTotalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchUsuarios(usuariosPage - 1)}
                    disabled={usuariosPage <= 1}
                    className="px-3 py-1.5 rounded-lg border border-brand-beige text-brand-charcoal/70 hover:bg-brand-beige/50 disabled:opacity-40 transition-colors"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => fetchUsuarios(usuariosPage + 1)}
                    disabled={usuariosPage >= usuariosTotalPages}
                    className="px-3 py-1.5 rounded-lg border border-brand-beige text-brand-charcoal/70 hover:bg-brand-beige/50 disabled:opacity-40 transition-colors"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>
      {usuarioDetalhes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" style={{ overscrollBehavior: "contain" }} role="dialog" aria-modal="true" aria-label="Detalhes do usuário" onKeyDown={(e) => { if (e.key === "Escape") setUsuarioDetalhes(null); }}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-brand-beige">
              <div>
                <h3 className="text-base font-semibold text-brand-charcoal">{usuarioDetalhes.usuario.nome}</h3>
                <p className="text-xs text-brand-charcoal/50">Cadastrado em {formatDate(usuarioDetalhes.usuario.created_at)}</p>
              </div>
              <button onClick={() => setUsuarioDetalhes(null)} className="text-brand-charcoal/40 hover:text-brand-charcoal text-lg font-bold">
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-brand-beige-light p-3.5 rounded-lg space-y-1.5">
                <h4 className="font-semibold text-brand-charcoal uppercase tracking-wider text-[11px] text-brand-purple">Dados de Acesso e Contato</h4>
                <p><strong>E-mail:</strong> {usuarioDetalhes.usuario.email}</p>
                <p><strong>Telefone / WhatsApp:</strong> {usuarioDetalhes.usuario.telefone}</p>
                <p><strong>CPF:</strong> {usuarioDetalhes.usuario.cpf}</p>
              </div>

              <div className="bg-brand-beige-light p-3.5 rounded-lg space-y-1.5">
                <h4 className="font-semibold text-brand-charcoal uppercase tracking-wider text-[11px] text-brand-purple">Endereço Completo</h4>
                <p><strong>Logradouro:</strong> {usuarioDetalhes.usuario.rua}, {usuarioDetalhes.usuario.numero}</p>
                {usuarioDetalhes.usuario.complemento && <p><strong>Complemento:</strong> {usuarioDetalhes.usuario.complemento}</p>}
                <p><strong>Bairro:</strong> {usuarioDetalhes.usuario.bairro}</p>
                <p><strong>Cidade/UF:</strong> {usuarioDetalhes.usuario.cidade} - {usuarioDetalhes.usuario.uf}</p>
                <p><strong>CEP:</strong> {usuarioDetalhes.usuario.cep}</p>
              </div>

              <div className="bg-brand-beige-light p-3.5 rounded-lg space-y-1.5">
                <h4 className="font-semibold text-brand-charcoal uppercase tracking-wider text-[11px] text-brand-purple">
                  Produtos Comprados ({usuarioDetalhes.produtos_comprados?.length || 0})
                </h4>
                {usuarioDetalhes.produtos_comprados && usuarioDetalhes.produtos_comprados.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {usuarioDetalhes.produtos_comprados.map((p: { nome: string; quantidade: number }, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-brand-beige text-brand-charcoal text-xs shadow-xs"
                      >
                        <span className="font-bold text-brand-purple">{p.quantidade}×</span>
                        <span>{p.nome}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-brand-charcoal/50 italic py-1">Nenhum produto adquirido ainda.</p>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-brand-charcoal mb-2 uppercase tracking-wider text-[11px] text-brand-purple">
                  Histórico de Pedidos ({usuarioDetalhes.pedidos.length})
                </h4>
                {usuarioDetalhes.pedidos.length === 0 ? (
                  <p className="text-brand-charcoal/50 italic py-2">Nenhum pedido realizado ainda.</p>
                ) : (
                  <div className="space-y-2">
                    {usuarioDetalhes.pedidos.map((ped: Pedido) => (
                      <div key={ped.id} className="p-2.5 border border-brand-beige rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-brand-charcoal">
                            {Array.isArray(ped.itens) && ped.itens.length > 0
                              ? ped.itens.map((it: { nome?: string; quantidade?: number }) => `${it.nome || "Item"} (${it.quantidade || 1}×)`).join(", ")
                              : (ped.produtos as { nome?: string } | undefined)?.nome || "Pedido E-commerce"}
                          </p>
                          <p className="text-[10px] text-brand-charcoal/50 font-mono">
                            {formatDate(ped.created_at)} — {ped.order_nsu}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-brand-purple">R$ {Number(ped.valor).toFixed(2)}</p>
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${ped.status === "pago" ? "bg-brand-mint/20 text-brand-mint-dark" : "bg-brand-terracotta/20 text-brand-terracotta-dark"}`}>
                            {ped.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-brand-beige flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const u = usuarioDetalhes.usuario;
                  setUsuarioDetalhes(null);
                  setUsuarioParaReset(u);
                  setNovaSenhaInput("");
                  setResetSenhaSucesso("");
                  setLinkAdminSucesso("");
                  setLinkAdminGerado("");
                  setCopiadoLinkAdmin(false);
                }}
                className="px-3 py-1.5 text-xs border border-brand-purple/30 text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Recuperar / Resetar Senha</span>
              </button>
              <button
                onClick={() => setUsuarioDetalhes(null)}
                className="px-4 py-2 text-xs bg-brand-beige hover:bg-brand-beige-dark text-brand-charcoal rounded-lg transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Reset de Senha pelo Admin */}
      {usuarioParaReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-xs"
          style={{ overscrollBehavior: "contain" }}
          role="dialog"
          aria-modal="true"
          aria-label="Resetar Senha"
          onKeyDown={(e) => {
            if (e.key === "Escape") setUsuarioParaReset(null);
          }}
        >
          <div className="bg-white rounded-2xl p-6 md:p-7 max-w-md w-full shadow-2xl border border-brand-beige">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-brand-purple/10 text-brand-purple">
                <KeyRound className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-brand-charcoal">Recuperação de Senha</h3>
                <p className="text-xs text-brand-charcoal/60">
                  Gerenciar acesso de <strong>{usuarioParaReset.nome}</strong>
                </p>
              </div>
            </div>

            {resetSenhaSucesso ? (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
                <span>{resetSenhaSucesso}</span>
              </div>
            ) : linkAdminSucesso ? (
              <div className="mt-4 space-y-4">
                <div className="p-3.5 bg-brand-beige-light/60 border border-brand-beige rounded-xl text-xs space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-brand-charcoal">Ação Processada!</p>
                      <p className="text-brand-charcoal/70 text-[11px] leading-relaxed mt-0.5">
                        {linkAdminSucesso}
                      </p>
                    </div>
                  </div>
                </div>

                {linkAdminGerado && (
                  <div className="space-y-3 bg-brand-charcoal/5 p-3.5 rounded-xl border border-brand-beige/80">
                    <label className="text-[11px] font-bold text-brand-charcoal/80 block uppercase tracking-wider">
                      Link Seguro de Redefinição (Válido por 1 hora)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={linkAdminGerado}
                        className="w-full bg-white border border-brand-beige rounded-lg px-2.5 py-1.5 text-xs text-brand-charcoal font-mono select-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(linkAdminGerado);
                          setCopiadoLinkAdmin(true);
                          setTimeout(() => setCopiadoLinkAdmin(false), 2500);
                        }}
                        className="px-3 py-1.5 bg-brand-charcoal hover:bg-brand-charcoal/90 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                      >
                        {copiadoLinkAdmin ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Botão de envio rápido via WhatsApp se o usuário tiver telefone */}
                    {usuarioParaReset.telefone && (
                      <div className="pt-1">
                        <a
                          href={`https://wa.me/55${usuarioParaReset.telefone.replace(/\D/g, "")}?text=${encodeURIComponent(
                            `Olá, ${usuarioParaReset.nome}! Aqui está o link seguro para você redefinir a sua senha de acesso no INstituto Kalapa (válido por 1 hora):\n\n${linkAdminGerado}\n\nQualquer dúvida, estamos à disposição!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs text-center"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Enviar pelo WhatsApp ({usuarioParaReset.telefone})</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setUsuarioParaReset(null);
                      setLinkAdminSucesso("");
                      setLinkAdminGerado("");
                    }}
                    className="px-4 py-2 bg-brand-beige hover:bg-brand-beige-dark/20 text-brand-charcoal text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Concluir
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mt-3">
                {/* Opção 1: Enviar Link por E-mail (Recomendado) */}
                <div className="p-3.5 rounded-xl border border-brand-purple/20 bg-brand-purple/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-brand-purple flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> Disparar E-mail Automático
                    </label>
                    <span className="text-[10px] font-semibold text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-full">
                      Recomendado
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-charcoal/70 leading-relaxed">
                    O sistema utilizará o servidor SMTP oficial da Hostinger para enviar o link seguro de 1 hora ao endereço <strong>{usuarioParaReset.email}</strong>. Você também poderá copiar o link para envio via WhatsApp.
                  </p>
                  <button
                    type="button"
                    onClick={handleEnviarLinkResetAdmin}
                    disabled={enviandoLinkAdmin}
                    className="w-full py-2 px-3 text-xs bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {enviandoLinkAdmin ? "Despachando pelo SMTP..." : `Enviar link de recuperação por e-mail`}
                  </button>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-brand-beige"></div>
                  <span className="flex-shrink mx-2 text-[10px] text-brand-charcoal/40 uppercase tracking-wider font-semibold">
                    ou definir senha manual
                  </span>
                  <div className="flex-grow border-t border-brand-beige"></div>
                </div>

                {/* Opção 2: Definir Manualmente */}
                <form onSubmit={handleResetarSenha} className="space-y-2">
                  <label className="text-xs font-semibold text-brand-charcoal/80 block">
                    Definir Nova Senha Manualmente
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={novaSenhaInput}
                    onChange={(e) => setNovaSenhaInput(e.target.value)}
                    placeholder="Mínimo de 8 caracteres"
                    className="w-full border border-brand-beige rounded-lg px-3 py-2 text-xs focus-visible:border-brand-purple outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={resetandoSenha || novaSenhaInput.length < 8}
                      className="px-3.5 py-1.5 text-xs bg-brand-charcoal text-white rounded-lg hover:bg-brand-charcoal/90 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {resetandoSenha ? "Salvando..." : "Salvar Senha Manual"}
                    </button>
                  </div>
                </form>

                <div className="flex justify-end pt-2 border-t border-brand-beige/60">
                  <button
                    type="button"
                    onClick={() => setUsuarioParaReset(null)}
                    className="px-4 py-1.5 text-xs text-brand-charcoal/60 hover:text-brand-charcoal transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {usuarioParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" style={{ overscrollBehavior: "contain" }} role="dialog" aria-modal="true" aria-label="Confirmar exclusão de usuário" onKeyDown={(e) => { if (e.key === "Escape") setUsuarioParaExcluir(null); }}>
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-semibold text-brand-charcoal mb-2">Excluir usuário?</h3>
            <p className="text-xs text-brand-charcoal/60 mb-5 leading-relaxed">
              Deseja realmente remover <strong>{usuarioParaExcluir.nome}</strong> ({usuarioParaExcluir.email})? O cadastro será excluído, mas o histórico financeiro dos pedidos continuará preservado no sistema.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setUsuarioParaExcluir(null)}
                className="px-4 py-2 text-xs text-brand-charcoal/60 hover:text-brand-charcoal transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleExcluirUsuario}
                disabled={excluindoUsuario}
                className="px-4 py-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {excluindoUsuario ? "Excluindo..." : "Sim, excluir usuário"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
