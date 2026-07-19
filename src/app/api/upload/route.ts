import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const BUCKET = "produtos";

export async function POST(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
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

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Tamanho máximo: 5MB." },
        { status: 400 }
      );
    }

    // Garantir que o bucket existe
    await supabaseAdmin.storage.createBucket(BUCKET, { public: true, fileSizeLimit: MAX_SIZE })
      .then(() => {})
      .catch(() => {});

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    const bytes = await file.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(filename, Buffer.from(bytes), {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      return NextResponse.json(
        { error: "Erro ao fazer upload da imagem" },
        { status: 500 }
      );
    }

    const { data: publicUrl } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(filename);

    return NextResponse.json({
      url: publicUrl.publicUrl,
      filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Erro ao fazer upload" }, { status: 500 });
  }
}
