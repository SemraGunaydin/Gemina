import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ['/', '/api/webhooks/clerk', '/api/webhooks/stripe'];

export default clerkMiddleware({
  // public route'lar
  publicRoutes: PUBLIC_ROUTES,
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
