import { NextRequest, NextResponse } from "next/server";
import { getClienteFromRequest } from "@/lib/cliente-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const usuario = await getClienteFromRequest(req);
    if (!usuario) {
      return NextResponse.json({ authenticated: false, usuario: null });
    }

    return NextResponse.json({
      authenticated: true,
      usuario,
    });
  } catch (error) {
    console.error("[auth/me] Erro ao consultar sessão:", error);
    return NextResponse.json({ authenticated: false, usuario: null });
  }
}
