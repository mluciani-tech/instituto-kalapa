import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const DIA_MS = 24 * 60 * 60 * 1000;
const LIMITE_REGISTROS = 5000;
const LIMITE_RECENTES = 100;

interface LinhaYinYang {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  tipo_resultado: "yang" | "yin";
  pontos_yang: number;
  pontos_yin: number;
  created_at: string;
}

interface LinhaEneagrama {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  tipos_principais: number[];
  created_at: string;
}

function temTelefone(t: string | null | undefined) {
  return !!t && t.trim().length >= 8;
}

function contarPeriodo(datas: string[], dias: number, deslocamentoDias = 0) {
  const agora = Date.now();
  const fim = agora - deslocamentoDias * DIA_MS;
  const inicio = fim - dias * DIA_MS;
  return datas.filter((d) => {
    const t = new Date(d).getTime();
    return t > inicio && t <= fim;
  }).length;
}

export async function GET(req: NextRequest) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const vazio = {
    yinyang: { total: 0, yang: 0, yin: 0, comTelefone: 0, ultimos7: 0, ultimos30: 0, anteriores30: 0 },
    eneagrama: {
      total: 0,
      porTipo: {} as Record<string, number>,
      empates: 0,
      tipoMaisComum: null as number | null,
      comTelefone: 0,
      ultimos7: 0,
      ultimos30: 0,
      anteriores30: 0,
    },
    combinado: { leadsUnicos: 0, fizeramAmbos: 0, comTelefoneUnicos: 0 },
    recentes: [],
    eneagramaDisponivel: true,
  };

  if (!isAdminConfigured()) {
    return NextResponse.json(vazio);
  }

  try {
    const search = (req.nextUrl.searchParams.get("search") || "").trim().toLowerCase();

    const [yyRes, enRes] = await Promise.all([
      supabaseAdmin!
        .from("avaliacoes_yin_yang")
        .select("id, nome, email, telefone, tipo_resultado, pontos_yang, pontos_yin, created_at")
        .order("created_at", { ascending: false })
        .limit(LIMITE_REGISTROS),
      supabaseAdmin!
        .from("avaliacoes_eneagrama")
        .select("id, nome, email, telefone, tipos_principais, created_at")
        .order("created_at", { ascending: false })
        .limit(LIMITE_REGISTROS),
    ]);

    // A tabela do Eneagrama pode ainda não existir (migration pendente): não derruba o painel.
    const eneagramaDisponivel = !enRes.error;
    if (yyRes.error) {
      console.warn("Aviso insights Yin/Yang:", yyRes.error.message);
    }
    if (enRes.error) {
      console.warn("Aviso insights Eneagrama (migration pendente?):", enRes.error.message);
    }

    const yy = (yyRes.data || []) as LinhaYinYang[];
    const en = (enRes.data || []) as LinhaEneagrama[];

    // ---- Yin/Yang ----
    const yyDatas = yy.map((r) => r.created_at);
    const yinyang = {
      total: yy.length,
      yang: yy.filter((r) => r.tipo_resultado === "yang").length,
      yin: yy.filter((r) => r.tipo_resultado === "yin").length,
      comTelefone: yy.filter((r) => temTelefone(r.telefone)).length,
      ultimos7: contarPeriodo(yyDatas, 7),
      ultimos30: contarPeriodo(yyDatas, 30),
      anteriores30: contarPeriodo(yyDatas, 30, 30),
    };

    // ---- Eneagrama ----
    const porTipo: Record<string, number> = {};
    for (let i = 1; i <= 9; i++) porTipo[String(i)] = 0;
    for (const r of en) {
      const principal = r.tipos_principais?.[0];
      if (principal >= 1 && principal <= 9) porTipo[String(principal)] += 1;
    }
    const tipoMaisComum =
      en.length > 0
        ? Number(Object.entries(porTipo).sort((a, b) => b[1] - a[1])[0][0])
        : null;
    const enDatas = en.map((r) => r.created_at);
    const eneagrama = {
      total: en.length,
      porTipo,
      empates: en.filter((r) => (r.tipos_principais?.length || 0) > 1).length,
      tipoMaisComum,
      comTelefone: en.filter((r) => temTelefone(r.telefone)).length,
      ultimos7: contarPeriodo(enDatas, 7),
      ultimos30: contarPeriodo(enDatas, 30),
      anteriores30: contarPeriodo(enDatas, 30, 30),
    };

    // ---- Combinado (leads únicos por e-mail) ----
    const emailsYY = new Set(yy.map((r) => r.email.toLowerCase()));
    const emailsEN = new Set(en.map((r) => r.email.toLowerCase()));
    const todosEmails = new Set([...emailsYY, ...emailsEN]);
    const fizeramAmbos = [...emailsYY].filter((e) => emailsEN.has(e)).length;

    const telefonePorEmail = new Map<string, boolean>();
    for (const r of [...yy, ...en]) {
      const k = r.email.toLowerCase();
      telefonePorEmail.set(k, telefonePorEmail.get(k) || temTelefone(r.telefone));
    }
    const combinado = {
      leadsUnicos: todosEmails.size,
      fizeramAmbos,
      comTelefoneUnicos: [...telefonePorEmail.values()].filter(Boolean).length,
    };

    // ---- Lista combinada (visão "Todos") ----
    const recentesBrutos = [
      ...yy.map((r) => ({
        id: r.id,
        teste: "yinyang" as const,
        nome: r.nome,
        email: r.email,
        telefone: r.telefone,
        created_at: r.created_at,
        resultado: r.tipo_resultado === "yang" ? "Yang (Calor)" : "Yin (Frescor)",
        detalhe: `${r.pontos_yang} Yang / ${r.pontos_yin} Yin`,
      })),
      ...en.map((r) => ({
        id: r.id,
        teste: "eneagrama" as const,
        nome: r.nome,
        email: r.email,
        telefone: r.telefone,
        created_at: r.created_at,
        resultado: (r.tipos_principais || []).map((t) => `Tipo ${t}`).join(" / "),
        detalhe: (r.tipos_principais?.length || 0) > 1 ? "Empate técnico" : "Tipo dominante",
      })),
    ];

    const recentes = recentesBrutos
      .filter((r) =>
        !search
          ? true
          : r.nome.toLowerCase().includes(search) ||
            r.email.toLowerCase().includes(search) ||
            (r.telefone || "").toLowerCase().includes(search)
      )
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, LIMITE_RECENTES);

    return NextResponse.json({
      yinyang,
      eneagrama,
      combinado,
      recentes,
      eneagramaDisponivel,
    });
  } catch (err: unknown) {
    console.error("Exceção na rota GET /api/admin/avaliacoes/insights:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao carregar insights" },
      { status: 500 }
    );
  }
}
