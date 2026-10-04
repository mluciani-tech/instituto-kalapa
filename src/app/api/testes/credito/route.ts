import { NextRequest, NextResponse } from "next/server";
import { getClienteFromRequest } from "@/lib/cliente-auth";
import {
  verificarCreditoDisponivel,
  listarCreditosUsuario,
  normalizarSlugTeste,
} from "@/lib/testes-creditos";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const usuario = await getClienteFromRequest(req);
    const slug = req.nextUrl.searchParams.get("slug");

    // Se não informou slug, retorna a lista completa de créditos do cliente
    if (!slug) {
      if (!usuario) {
        return NextResponse.json({ authenticated: false, creditos: [] });
      }
      const creditos = await listarCreditosUsuario(usuario.id, usuario.email);
      return NextResponse.json({ authenticated: true, creditos });
    }

    // Se informou slug, busca dados do produto teste correspondente
    const slugNormalizado = normalizarSlugTeste(slug);
    const slugVariante = slugNormalizado.replace(/^teste-/, "");

    let produtoTeste = null;
    if (supabaseAdmin) {
      try {
        const { data: prod } = await supabaseAdmin
          .from("produtos")
          .select(
            "id, nome, slug, preco, preco_promocional, imagem_url, rota_teste, orientacoes_pre_teste, inclui_laudo_pdf, ativo"
          )
          .or(`slug.eq.${slugNormalizado},slug.eq.${slugVariante},rota_teste.ilike.%${slugVariante}%`)
          .limit(1)
          .maybeSingle();

        produtoTeste = prod;
      } catch (err) {
        console.warn("[api/testes/credito] Erro ao buscar produto teste:", err);
      }
    }

    if (!usuario) {
      return NextResponse.json({
        authenticated: false,
        disponivel: false,
        creditosRestantes: 0,
        produto: produtoTeste,
      });
    }

    const { disponivel, creditosRestantes } = await verificarCreditoDisponivel(
      usuario.id,
      usuario.email,
      slug
    );

    return NextResponse.json({
      authenticated: true,
      disponivel,
      creditosRestantes,
      produto: produtoTeste,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("[api/testes/credito] Erro:", error);
    return NextResponse.json(
      { error: "Erro interno ao verificar créditos de teste." },
      { status: 500 }
    );
  }
}
