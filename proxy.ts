import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  '/', 
  '/api/webhooks/clerk', 
  '/api/webhooks/stripe'
]);

export default clerkMiddleware(async (auth, request) => {
  // Eğer rota halka açık değilse koruma altına alıyoruz
  if (!isPublicRoute(request)) {
    // auth() bir Promise döndürdüğü için await kullanmalısın
    await auth.protect(); 
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};