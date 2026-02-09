// proxy.ts
import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

const publicRoutes = ['/', '/api/webhooks/clerk', '/api/webhooks/stripe'];

function isPublicRoute(req: NextRequest) {
  return publicRoutes.includes(req.nextUrl.pathname);
}

export async function proxy(req: NextRequest) {
  if (isPublicRoute(req)) {
    return; // public route, auth kontrolüne gerek yok
  }

  // auth kontrolü
  return clerkMiddleware()(req);
}

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/api/(.*)",
  ],
};
