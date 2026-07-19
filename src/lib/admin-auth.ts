import { NextRequest } from "next/server";
import { verifySessionToken } from "./auth";

export async function checkAdminAuth(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("admin_session")?.value;
  return !!token && (await verifySessionToken(token));
}
