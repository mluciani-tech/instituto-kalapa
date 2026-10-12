import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

// Limite de 50MB conforme alinhado
const MAX_SIZE = 50 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
  "pdf", "doc", "docx", "xls", "xlsx", "png", "jpg", "jpeg", "webp", "mp3", "txt"
];

const BUCKET = "biblioteca";

export async function POST(req: NextRequest) {
  try {
    if (!(await checkAdminAuth(req))) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase não configurado" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // Identificar extensão a partir do nome
    const originalName = file.name || "arquivo";
    const parts = originalName.split(".");
    const ext = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";

    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        {
          error: `Formato de arquivo não suportado (.${ext}). Permitidos: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, MP3, TXT.`,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Arquivo muito grande. O limite máximo permitido é de 50MB." },
        { status: 400 }
      );
    }

    // Garantir que o bucket 'biblioteca' exista (public: false para downloads protegidos)
    await supabaseAdmin.storage
      .createBucket(BUCKET, { public: false, fileSizeLimit: MAX_SIZE })
      .then(() => {})
      .catch(() => {});

    const randomSuffix = crypto.randomBytes(8).toString("hex");
    const safeBaseName = originalName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}-${randomSuffix}-${safeBaseName}`;

    const bytes = await file.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(filename, Buffer.from(bytes), {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      console.error("[upload-arquivo] Erro no Supabase storage:", uploadError);
      return NextResponse.json(
        { error: "Erro ao salvar arquivo no armazenamento: " + uploadError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: filename, // Identificador/path no bucket
      originalName,
      size: file.size,
      bucket: BUCKET,
    });
  } catch (error) {
    console.error("[upload-arquivo] Erro inesperado:", error);
    return NextResponse.json({ error: "Erro interno no upload de arquivo" }, { status: 500 });
  }
}
