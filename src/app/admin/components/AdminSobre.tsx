"use client";

import { useState, useEffect, useCallback } from "react";
import { FOTO_FACILITADORA_PADRAO } from "@/lib/config";
import { FAQ_PADRAO_ADMIN } from "../lib/format";

type Props = {
  onError: (message: string) => void;
};

export default function AdminSobre({ onError }: Props) {
  const setError = onError;

  // Sobre & FAQ Facilitadora
  const [facilitadoraNome, setFacilitadoraNome] = useState("");
  const [facilitadoraTitulo, setFacilitadoraTitulo] = useState("");
  const [facilitadoraFoto, setFacilitadoraFoto] = useState("");
  const [facilitadoraCredenciais, setFacilitadoraCredenciais] = useState("");
  const [facilitadoraBio, setFacilitadoraBio] = useState("");
  const [espacoTitulo, setEspacoTitulo] = useState("");
  const [espacoDescricao, setEspacoDescricao] = useState("");
  const [espacoFotos, setEspacoFotos] = useState<string[]>([]);
  const [faqItens, setFaqItens] = useState<{ pergunta: string; resposta: string }[]>([]);
  const [fotoFacilitadoraFile, setFotoFacilitadoraFile] = useState<File | null>(null);
  const [uploadingFotoFacilitadora, setUploadingFotoFacilitadora] = useState(false);
  const [uploadingFotosEspaco, setUploadingFotosEspaco] = useState(false);
  const [novaFotoEspacoUrl, setNovaFotoEspacoUrl] = useState("");
  const [salvandoSobre, setSalvandoSobre] = useState(false);
  const [sobreSucesso, setSobreSucesso] = useState("");

  const fetchConfig = useCallback(async () => {
    const res = await fetch("/api/config");
    if (res.ok) {
      const data = await res.json();
      setFacilitadoraNome(data.facilitadora_nome || "Clatihúcia Capeli");
      setFacilitadoraTitulo(data.facilitadora_titulo || "Facilitadora, Psicóloga, Psicogenealogista, Terapeuta Sistêmica e Transpessoal");
      setFacilitadoraFoto(data.facilitadora_foto || FOTO_FACILITADORA_PADRAO);
      setFacilitadoraCredenciais(data.facilitadora_credenciais || "Constelação Familiar, Vivências em Grupo e Acolhimento do Trauma");
      setFacilitadoraBio(data.facilitadora_bio || "Com mais de 10 anos de dedicação ao cuidado emocional e ao desenvolvimento humano, Clatihúcia Capeli conduz vivências que acolhem a dor sem julgamentos, permitindo que ela se transforme em força e consciência.\n\nSua abordagem integra a sabedoria sistêmica das constelações familiares, a neurobiologia do trauma e a potência curativa da presença em grupo. Cada encontro é cuidadosamente preparado para ser um santuário de respeito, acolhimento genuíno e pertencimento.");
      setEspacoTitulo(data.espaco_titulo || "Espaço Serena — Refúgio e Natureza");
      setEspacoDescricao(data.espaco_descricao || "Localizado em meio à natureza na Granja Viana (Cotia - SP), o espaço foi concebido como um refúgio acolhedor, silencioso e seguro para vivências presenciais transformadoras.");
      if (data.espaco_fotos) {
        try {
          const parsed = JSON.parse(data.espaco_fotos);
          if (Array.isArray(parsed)) setEspacoFotos(parsed);
        } catch {
          setEspacoFotos(["/foto2.jpg", "/foto4.jpg", "/foto6a.jpg"]);
        }
      } else {
        setEspacoFotos(["/foto2.jpg", "/foto4.jpg", "/foto6a.jpg"]);
      }
      if (data.faq_itens) {
        try {
          const parsed = JSON.parse(data.faq_itens);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFaqItens(parsed);
          } else {
            setFaqItens(FAQ_PADRAO_ADMIN);
          }
        } catch {
          setFaqItens(FAQ_PADRAO_ADMIN);
        }
      } else {
        setFaqItens(FAQ_PADRAO_ADMIN);
      }
    }
  }, []);

  useEffect(() => {
    void fetchConfig();
  }, [fetchConfig]);

  // Handlers para Sobre & FAQ
  const handleUploadFotoFacilitadora = async (file: File) => {
    setUploadingFotoFacilitadora(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        setFacilitadoraFoto(json.url);
        setSobreSucesso("Foto da facilitadora enviada com sucesso!");
        setTimeout(() => setSobreSucesso(""), 4000);
      } else {
        const json = await res.json();
        setError(json.error || "Erro ao enviar imagem");
      }
    } catch {
      setError("Erro ao conectar com o servidor para upload");
    } finally {
      setUploadingFotoFacilitadora(false);
      setFotoFacilitadoraFile(null);
    }
  };

  const handleUploadFotosEspaco = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploadingFotosEspaco(true);
    setError("");

    const fileArray = Array.from(files);
    const novasUrls: string[] = [];

    try {
      for (const file of fileArray) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const json = await res.json();
          if (json.url) {
            novasUrls.push(json.url);
          }
        } else {
          const json = await res.json();
          throw new Error(json.error || `Erro ao enviar ${file.name}`);
        }
      }

      if (novasUrls.length > 0) {
        setEspacoFotos((prev) => [...prev, ...novasUrls]);
        setSobreSucesso(
          novasUrls.length === 1
            ? "Foto do espaço enviada com sucesso!"
            : `${novasUrls.length} fotos do espaço enviadas com sucesso!`
        );
        setTimeout(() => setSobreSucesso(""), 4000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao enviar fotos do espaço";
      setError(msg);
    } finally {
      setUploadingFotosEspaco(false);
    }
  };

  const handleRemoverFotoEspaco = (indexToRemove: number) => {
    setEspacoFotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAdicionarFotoEspacoUrl = () => {
    if (!novaFotoEspacoUrl.trim()) return;
    setEspacoFotos((prev) => [...prev, novaFotoEspacoUrl.trim()]);
    setNovaFotoEspacoUrl("");
  };

  const handleSalvarSobre = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoSobre(true);
    setSobreSucesso("");
    setError("");

    try {
      // Se houver arquivo selecionado mas não enviado, enviar primeiro
      let fotoFinal = facilitadoraFoto;
      if (fotoFacilitadoraFile) {
        const formData = new FormData();
        formData.append("file", fotoFacilitadoraFile);
        const upRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (upRes.ok) {
          const upJson = await upRes.json();
          fotoFinal = upJson.url;
          setFacilitadoraFoto(fotoFinal);
          setFotoFacilitadoraFile(null);
        }
      }

      const updates = [
        { chave: "facilitadora_nome", valor: facilitadoraNome.trim() },
        { chave: "facilitadora_titulo", valor: facilitadoraTitulo.trim() },
        { chave: "facilitadora_foto", valor: fotoFinal.trim() },
        { chave: "facilitadora_credenciais", valor: facilitadoraCredenciais.trim() },
        { chave: "facilitadora_bio", valor: facilitadoraBio.trim() },
        { chave: "espaco_titulo", valor: espacoTitulo.trim() },
        { chave: "espaco_descricao", valor: espacoDescricao.trim() },
        { chave: "espaco_fotos", valor: JSON.stringify(espacoFotos) },
        { chave: "faq_itens", valor: JSON.stringify(faqItens) },
      ];

      for (const item of updates) {
        const r = await fetch("/api/config", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        if (!r.ok) {
          const errJson = await r.json();
          throw new Error(errJson.error || `Erro ao salvar ${item.chave}`);
        }
      }

      setSobreSucesso("Informações da Facilitadora, Espaço e FAQ salvas com sucesso!");
      await fetchConfig();
      setTimeout(() => setSobreSucesso(""), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar informações");
    } finally {
      setSalvandoSobre(false);
    }
  };

  return (
          <div className="space-y-6">
            {sobreSucesso && (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-medium flex items-center gap-2">
                <span>✓</span> {sobreSucesso}
              </div>
            )}

            <form onSubmit={handleSalvarSobre} className="space-y-6">
              {/* Bloco 1: A Facilitadora */}
              <div className="bg-white rounded-xl border border-brand-beige p-6 shadow-xs">
                <div className="flex items-center gap-2 pb-4 mb-6 border-b border-brand-beige">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B8965A]" />
                  <h2 className="text-base font-semibold text-brand-charcoal">
                    Perfil da Facilitadora
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Foto da facilitadora */}
                  <div className="md:col-span-1 space-y-3">
                    <label className="block text-xs font-semibold text-brand-charcoal/80 uppercase tracking-wider">
                      Foto de Perfil
                    </label>
                    <div className="relative aspect-3/4 max-w-[220px] rounded-xl overflow-hidden border-2 border-[#B8965A]/40 bg-brand-beige/20 shadow-xs group">
                      {facilitadoraFoto ? (
                        <img
                          src={facilitadoraFoto}
                          alt={facilitadoraNome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-brand-charcoal/40">
                          Sem foto
                        </div>
                      )}
                      {uploadingFotoFacilitadora && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-xs gap-2">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Enviando...</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="inline-block px-3 py-1.5 text-xs font-medium text-brand-purple bg-brand-purple/5 hover:bg-brand-purple/10 rounded-lg cursor-pointer transition-colors">
                        <span>Carregar nova foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFotoFacilitadoraFile(file);
                              void handleUploadFotoFacilitadora(file);
                            }
                          }}
                        />
                      </label>
                      <input
                        type="text"
                        value={facilitadoraFoto}
                        onChange={(e) => setFacilitadoraFoto(e.target.value)}
                        placeholder="Ou cole a URL da imagem"
                        className="w-full text-xs px-3 py-2 border border-brand-beige rounded-lg focus-visible:ring-2 focus-visible:ring-brand-purple/30 text-brand-charcoal"
                      />
                    </div>
                  </div>

                  {/* Informações textuais */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-brand-charcoal/80 uppercase tracking-wider mb-1.5">
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          value={facilitadoraNome}
                          onChange={(e) => setFacilitadoraNome(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30 font-medium text-brand-charcoal"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-brand-charcoal/80 uppercase tracking-wider mb-1.5">
                          Título / Especialidade
                        </label>
                        <input
                          type="text"
                          value={facilitadoraTitulo}
                          onChange={(e) => setFacilitadoraTitulo(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30 text-brand-charcoal"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-charcoal/80 uppercase tracking-wider mb-1.5">
                        Credenciais & Formações (Separadas por vírgula)
                      </label>
                      <input
                        type="text"
                        value={facilitadoraCredenciais}
                        onChange={(e) => setFacilitadoraCredenciais(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30 text-brand-charcoal"
                        placeholder="Constelação Familiar, Vivências em Grupo..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-charcoal/80 uppercase tracking-wider mb-1.5">
                        Biografia / Filosofia de Acolhimento
                      </label>
                      <textarea
                        rows={6}
                        value={facilitadoraBio}
                        onChange={(e) => setFacilitadoraBio(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30 text-brand-charcoal leading-relaxed"
                        placeholder="Escreva a trajetória, abordagem e acolhimento..."
                      />
                      <p className="text-[11px] text-brand-charcoal/40 mt-1">
                        Dica: use quebras de linha para separar parágrafos naturalmente no site.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloco 2: O Espaço */}
              <div className="bg-white rounded-xl border border-brand-beige p-6 shadow-xs">
                <div className="flex items-center gap-2 pb-4 mb-6 border-b border-brand-beige">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-purple" />
                  <h2 className="text-base font-semibold text-brand-charcoal">
                    O Espaço & Localização
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal/80 uppercase tracking-wider mb-1.5">
                      Título do Espaço
                    </label>
                    <input
                      type="text"
                      value={espacoTitulo}
                      onChange={(e) => setEspacoTitulo(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30 text-brand-charcoal font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal/80 uppercase tracking-wider mb-1.5">
                      Descrição e Atmosfera do Espaço
                    </label>
                    <textarea
                      rows={3}
                      value={espacoDescricao}
                      onChange={(e) => setEspacoDescricao(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30 text-brand-charcoal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal/80 uppercase tracking-wider mb-2">
                      Fotos do Espaço ({espacoFotos.length})
                    </label>

                    {/* Grade de Miniaturas com botão de remover */}
                    {espacoFotos.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-3">
                        {espacoFotos.map((fotoUrl, idx) => (
                          <div
                            key={`${fotoUrl}-${idx}`}
                            className="group relative aspect-video rounded-lg overflow-hidden border border-brand-beige bg-brand-beige-light/30 shadow-xs"
                          >
                            <img
                              src={fotoUrl}
                              alt={`Espaço ${idx + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoverFotoEspaco(idx)}
                              className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 cursor-pointer shadow-xs"
                              title="Remover foto"
                              aria-label={`Remover foto ${idx + 1}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                            <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/50 text-[10px] text-white rounded font-mono">
                              #{idx + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Botão de upload no mesmo padrão do produto */}
                    <div className="space-y-2">
                      <label
                        className={`flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                          uploadingFotosEspaco
                            ? "border-brand-purple/50 bg-brand-purple/5 cursor-not-allowed"
                            : "border-brand-beige hover:border-brand-purple/50 hover:bg-brand-purple/5"
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          disabled={uploadingFotosEspaco}
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              void handleUploadFotosEspaco(e.target.files);
                              e.target.value = "";
                            }
                          }}
                        />
                        {uploadingFotosEspaco ? (
                          <div className="flex items-center gap-2 text-sm text-brand-purple">
                            <div className="w-4 h-4 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
                            <span>Enviando fotos para o servidor...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-brand-charcoal/60 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium text-brand-purple">Clique para selecionar foto(s)</span>
                            <span className="text-xs text-brand-charcoal/40 hidden sm:inline">(seleção múltipla permitida)</span>
                          </div>
                        )}
                      </label>
                      <p className="text-xs text-brand-charcoal/40">JPEG, PNG, WebP ou GIF. Máximo 5MB por foto.</p>

                      {/* Opção secundária: Adicionar por URL */}
                      <div className="pt-2 flex items-center gap-2">
                        <input
                          type="text"
                          value={novaFotoEspacoUrl}
                          onChange={(e) => setNovaFotoEspacoUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAdicionarFotoEspacoUrl();
                            }
                          }}
                          placeholder="Ou cole uma URL / caminho de imagem (ex: /foto7.jpg)"
                          className="flex-1 text-xs px-3 py-2 border border-brand-beige rounded-lg focus-visible:ring-2 focus-visible:ring-brand-purple/30 text-brand-charcoal"
                        />
                        <button
                          type="button"
                          onClick={handleAdicionarFotoEspacoUrl}
                          disabled={!novaFotoEspacoUrl.trim()}
                          className="px-3 py-2 text-xs font-medium text-brand-purple bg-brand-purple/10 hover:bg-brand-purple/20 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer"
                        >
                          + Adicionar URL
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloco 3: Dúvidas Frequentes (FAQ) */}
              <div className="bg-white rounded-xl border border-brand-beige p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-brand-beige">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <h2 className="text-base font-semibold text-brand-charcoal">
                      Perguntas Frequentes (FAQ Acolhedor)
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFaqItens([
                        ...faqItens,
                        { pergunta: "Nova Pergunta", resposta: "Explicação acolhedora..." },
                      ])
                    }
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-medium transition-colors"
                  >
                    + Adicionar Pergunta
                  </button>
                </div>

                <div className="space-y-4">
                  {faqItens.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-brand-beige/80 bg-brand-beige/10 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-brand-charcoal/50">
                          #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = faqItens.filter((_, i) => i !== idx);
                            setFaqItens(updated);
                          }}
                          className="text-xs text-red-600 hover:text-red-700 hover:underline"
                        >
                          Remover
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">
                          Pergunta:
                        </label>
                        <input
                          type="text"
                          value={item.pergunta}
                          onChange={(e) => {
                            const updated = [...faqItens];
                            updated[idx].pergunta = e.target.value;
                            setFaqItens(updated);
                          }}
                          className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm bg-white text-brand-charcoal font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">
                          Resposta:
                        </label>
                        <textarea
                          rows={3}
                          value={item.resposta}
                          onChange={(e) => {
                            const updated = [...faqItens];
                            updated[idx].resposta = e.target.value;
                            setFaqItens(updated);
                          }}
                          className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm bg-white text-brand-charcoal leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}

                  {faqItens.length === 0 && (
                    <p className="text-xs text-brand-charcoal/40 text-center py-4">
                      Nenhuma pergunta cadastrada. Clique acima para adicionar ou o sistema usará as perguntas padrão.
                    </p>
                  )}
                </div>
              </div>

              {/* Botão Salvar Todas as Alterações */}
              <div className="flex items-center justify-end gap-3 sticky bottom-4 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-brand-beige shadow-lg">
                <button
                  type="submit"
                  disabled={salvandoSobre}
                  className="px-6 py-3 bg-brand-purple text-white font-medium text-sm rounded-lg hover:bg-brand-purple-dark transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {salvandoSobre && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {salvandoSobre ? "Salvando Informações..." : "Salvar Sobre & FAQ"}
                </button>
              </div>
            </form>
          </div>
  );
}
