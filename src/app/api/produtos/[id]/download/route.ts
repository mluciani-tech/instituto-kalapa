import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { getClienteFromRequest } from "@/lib/cliente-auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Verificar se o usuário está logado
    const usuario = await getClienteFromRequest(req);
    if (!usuario) {
      return NextResponse.json(
        { error: "Faça login no aplicativo para baixar este arquivo.", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    if (!isAdminConfigured()) {
      return NextResponse.json({ error: "Serviço temporariamente indisponível." }, { status: 500 });
    }

    // 2. Buscar informações do produto
    const { data: produto, error: prodErr } = await supabaseAdmin!
      .from("produtos")
      .select("id, nome, preco, arquivo_url, arquivo_nome, is_biblioteca, ativo")
      .eq("id", id)
      .single();

    if (prodErr || !produto) {
      return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
    }

    if (!produto.arquivo_url) {
      return NextResponse.json(
        { error: "Nenhum arquivo digital disponível para este produto." },
        { status: 404 }
      );
    }

    const precoNum = Number(produto.preco) || 0;
    const isGratuito = precoNum === 0;

    // 3. Se for pago, validar se o usuário comprou este produto
    if (!isGratuito) {
      // Verifica na tabela de pedidos se há pedido pago/aprovado para este cliente
      const { data: pedidoValido, error: pedErr } = await supabaseAdmin!
        .from("pedidos")
        .select("id, status")
        .eq("produto_id", id)
        .eq("cliente_email", usuario.email)
        .in("status", ["pago", "aprovado", "concluido", "finalizado", "confirmado"])
        .limit(1)
        .maybeSingle();

      if (pedErr || !pedidoValido) {
        return NextResponse.json(
          {
            error: "Você ainda não adquiriu este material. Conclua a compra para liberar o download.",
            code: "PURCHASE_REQUIRED",
          },
          { status: 403 }
        );
      }
    }

    // 4. Registrar telemetria/log de download para controle e prospecção de leads
    try {
      // Buscar telefone atualizado do usuário caso disponível no cadastro
      let clienteTelefone = usuario.telefone || "";
      let clienteNome = usuario.nome || "";

      if (!clienteTelefone) {
        const { data: userDb } = await supabaseAdmin!
          .from("usuarios")
          .select("nome, telefone")
          .eq("id", usuario.id)
          .maybeSingle();

        if (userDb) {
          if (userDb.telefone) clienteTelefone = userDb.telefone;
          if (userDb.nome) clienteNome = userDb.nome;
        }
      }

      await supabaseAdmin!.from("downloads_biblioteca").insert({
        produto_id: produto.id,
        usuario_id: usuario.id,
        cliente_nome: clienteNome,
        cliente_email: usuario.email,
        cliente_telefone: clienteTelefone,
        arquivo_nome: produto.arquivo_nome || "arquivo",
      });
    } catch (logErr) {
      // Falha não-bloqueante de telemetria para não interromper a experiência do usuário
      console.warn("[download] Aviso ao registrar log de download:", logErr);
    }

    // 5. Gerar Signed URL para download seguro do Supabase Storage
    const BUCKET = "biblioteca";
    const filePath = produto.arquivo_url;

    // Se for uma URL completa externa ou legado, redireciona diretamente
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return NextResponse.redirect(filePath);
    }

    // Gerar URL assinada válida por 60 segundos
    const { data: signedData, error: signErr } = await supabaseAdmin!.storage
      .from(BUCKET)
      .createSignedUrl(filePath, 60, {
        download: produto.arquivo_nome || "arquivo",
      });

    if (signErr || !signedData?.signedUrl) {
      console.error("[download] Erro ao assinar URL do arquivo:", signErr);
      return NextResponse.json(
        { error: "Erro ao gerar link de download seguro. Tente novamente mais tarde." },
        { status: 500 }
      );
    }

    return NextResponse.redirect(signedData.signedUrl);
  } catch (error) {
    console.error("[download] Erro inesperado:", error);
    return NextResponse.json({ error: "Erro interno no servidor ao processar download." }, { status: 500 });
  }
}
