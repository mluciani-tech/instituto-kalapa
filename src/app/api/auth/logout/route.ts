import { NextResponse } from "next/server";
import { clearClienteSessionCookie } from "@/lib/cliente-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ success: true });
  clearClienteSessionCookie(res);
  return res;
}
