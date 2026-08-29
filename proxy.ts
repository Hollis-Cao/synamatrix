import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const clerk = clerkMiddleware();

export default async function proxy(
  request: Parameters<typeof clerk>[0],
  event: Parameters<typeof clerk>[1],
) {
  try {
    return await clerk(request, event);
  } catch (error) {
    // A handshake token from an older Clerk instance cannot be verified after
    // switching the site to production. Drop only that stale one-time token so
    // Clerk can start a fresh production handshake instead of returning a 500.
    if (request.nextUrl.searchParams.has("__clerk_handshake")) {
      const cleanUrl = request.nextUrl.clone();
      cleanUrl.searchParams.delete("__clerk_handshake");
      return NextResponse.redirect(cleanUrl);
    }

    throw error;
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
