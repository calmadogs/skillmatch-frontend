import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Se não estiver logado, bloqueia rotas protegidas
  if (!token) {
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // Decodifica o token (apenas payload, sem validar assinatura)
  const payload = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );

  const role = payload.role;

  // BLOQUEIOS POR ROLE
  if (req.nextUrl.pathname.startsWith("/dashboard/projects/new")) {
    if (role !== "CLIENT") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", // protege todo dashboard
  ],
};
