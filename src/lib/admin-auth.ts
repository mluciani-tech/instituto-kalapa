import { NextRequest } from "next/server";
import { verifySessionToken } from "./auth";

/** Verifica se a requisição tem sessão admin válida */
export function checkAdminAuth(req: NextRequest): boolean {
  const token = req.cookies.get("admin_session")?.value;
  return !!token && verifySessionToken(token);
}
