import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

const INFINITEPAY_API = "https://api.checkout.infinitepay.io/links";
const INFINITEPAY_HANDLE = process.env.INFINITEPAY_HANDLE || "kalapa";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://instituto-kalapa.vercel.app";

interface CheckoutItem {
  quantity: number;
  price: number;
  description: string;
}

interface CheckoutPayload {
  items: CheckoutItem[];
  order_nsu?: string;
  redirect_url?: string;
  webhook_url?: string;
  customer?: {
    name?: string;
    email?: string;
    phone_number?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, order_nsu, customer } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items são obrigatórios" },
        { status: 400 }
      );
    }

    const payload: CheckoutPayload = {
      items,
      order_nsu: order_nsu || `kalapa-${Date.now()}`,
      redirect_url: `${SITE_URL}/checkout/sucesso`,
      webhook_url: `${SITE_URL}/api/webhook`,
    };

    if (customer) {
      payload.customer = customer;
    }

    const response = await fetch(INFINITEPAY_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        handle: INFINITEPAY_HANDLE,
        ...payload,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[checkout] Erro da InfinitePay:", data);
      return NextResponse.json(
        { error: "Erro ao criar link de pagamento", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({
      url: data.url,
      order_nsu: payload.order_nsu,
    });
  } catch (error) {
    console.error("[checkout] Erro inesperado:", error);
    return NextResponse.json(
      { error: "Erro ao processar checkout" },
      { status: 500 }
    );
  }
}
