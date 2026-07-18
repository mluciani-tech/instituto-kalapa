import { NextRequest, NextResponse } from "next/server";
import { createSessionToken } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

// Máx 5 tentativas a cada 15 minutos por IP
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimit(`login:${ip}`, MAX_ATTEMPTS, WINDOW_MS)) {
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente em 15 minutos." },
        { status: 429 }
      );
    }

    const { password } = await req.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Senha é obrigatória" },
        { status: 400 }
      );
    }

    const token = createSessionToken(password);

    if (!token) {
      return NextResponse.json(
        { error: "Senha inválida" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Erro ao processar login" },
      { status: 500 }
    );
  }
}
