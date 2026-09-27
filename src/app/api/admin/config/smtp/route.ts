import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuth(req);
    if (!isAuthed) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json({
        smtp: {
          host: process.env.SMTP_HOST || "smtp.hostinger.com",
          port: process.env.SMTP_PORT || "465",
          user: process.env.SMTP_USER || "",
          pass: process.env.SMTP_PASS ? "••••••••" : "",
          fromName: process.env.SMTP_FROM_NAME || "INstituto Kalapa",
        },
      });
    }

    const { data, error } = await supabaseAdmin!
      .from("configuracoes")
      .select("chave, valor")
      .in("chave", ["smtp_host", "smtp_port", "smtp_user", "smtp_pass", "smtp_from_name"]);

    if (error) {
      console.warn("[smtp-config] Erro ao buscar configuracoes:", error);
    }

    const map: Record<string, string> = {};
    data?.forEach((i) => {
      map[i.chave] = i.valor;
    });

    return NextResponse.json({
      smtp: {
        host: map.smtp_host || process.env.SMTP_HOST || "smtp.hostinger.com",
        port: map.smtp_port || process.env.SMTP_PORT || "465",
        user: map.smtp_user || process.env.SMTP_USER || "",
        pass: map.smtp_pass ? "••••••••" : (process.env.SMTP_PASS ? "••••••••" : ""),
        fromName: map.smtp_from_name || process.env.SMTP_FROM_NAME || "INstituto Kalapa",
      },
    });
  } catch (err) {
    console.error("[smtp-config] Erro inesperado:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuth(req);
    if (!isAuthed) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    const body = await req.json();
    const { host, port, user, pass, fromName } = body;

    const upserts = [
      { chave: "smtp_host", valor: (host || "smtp.hostinger.com").trim() },
      { chave: "smtp_port", valor: String(port || "465").trim() },
      { chave: "smtp_user", valor: (user || "").trim().toLowerCase() },
      { chave: "smtp_from_name", valor: (fromName || "INstituto Kalapa").trim() },
    ];

    // Se informou nova senha (não é o placeholder de bullets)
    if (pass && !pass.includes("••••")) {
      upserts.push({ chave: "smtp_pass", valor: pass });
    }

    for (const item of upserts) {
      await supabaseAdmin!
        .from("configuracoes")
        .upsert(
          { chave: item.chave, valor: item.valor, updated_at: new Date().toISOString() },
          { onConflict: "chave" }
        );
    }

    return NextResponse.json({ success: true, message: "Configurações SMTP da Hostinger salvas com sucesso!" });
  } catch (err) {
    console.error("[smtp-config] Erro ao salvar SMTP:", err);
    return NextResponse.json({ error: "Erro ao salvar configurações SMTP" }, { status: 500 });
  }
}
