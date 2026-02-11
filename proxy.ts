import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define routes that should be accessible without authentication
const isPublicRoute = createRouteMatcher([
  '/', 
  '/api/webhooks/clerk', 
  '/api/webhooks/stripe',
  '/sign-in(.*)', // Allows access to sign-in and nested routes
  '/sign-up(.*)'  // Allows access to sign-up and nested routes
]);

export default clerkMiddleware(async (auth, request) => {
  // If the route is not in the public list, protect it
  if (!isPublicRoute(request)) {
    // auth() is now asynchronous in Clerk v5+
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API and TRPC routes
    '/(api|trpc)(.*)',
  ],
};