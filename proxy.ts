// proxy.ts
import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

const publicRoutes = ['/', '/api/webhooks/clerk', '/api/webhooks/stripe'];

function isPublicRoute(req: NextRequest) {
  return publicRoutes.includes(req.nextUrl.pathname);
}

export const proxy = clerkMiddleware(
  async (auth, req) => {
    if (isPublicRoute(req)) {
      return; // public route, auth kontrolü yok
    }

    // Private route için auth kontrolü
    await auth.protect(); 
  },
  {} // options
);

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/api/(.*)",
  ],
};
