import { type NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

const PROTECTED = [
  "/dashboard",
  "/roadmap",
  "/practice-log",
  "/spaced-repetition",
  "/patterns",
  "/flowchart",
  "/cheatsheet",
  "/mental-game",
  "/practice-guide",
  "/daily-routine",
];

export default async function proxy(req: NextRequest) {
  const isProtected = PROTECTED.some((p) =>
    req.nextUrl.pathname.startsWith(p)
  );
  if (!isProtected) return NextResponse.next();

  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.redirect(new URL("/login", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/roadmap/:path*",
    "/practice-log/:path*",
    "/spaced-repetition/:path*",
    "/patterns/:path*",
    "/flowchart/:path*",
    "/cheatsheet/:path*",
    "/mental-game/:path*",
    "/practice-guide/:path*",
    "/daily-routine/:path*",
  ],
};
