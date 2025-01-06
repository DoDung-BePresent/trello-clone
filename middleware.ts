import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/organization(.*)",
  "/board(.*)",
  "/select-org",
  "/api/cards(.*)",
]);

export default clerkMiddleware(async (auth, req, event) => {
  const { userId, orgId, redirectToSignIn } = await auth();

  // Redirect to sign-in if not authenticated and accessing a protected route
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.nextUrl.href });
  }

  // Redirect authenticated users without orgId to '/select-org'
  if (userId && !orgId && req.nextUrl.pathname !== "/select-org") {
    return NextResponse.redirect(new URL("/select-org", req.nextUrl.origin));
  }

  // Redirect authenticated users with orgId to the organization page if not on a protected route
  if (userId && orgId && !isProtectedRoute(req)) {
    return NextResponse.redirect(
      new URL(`/organization/${orgId}`, req.nextUrl.origin)
    );
  }

  // Default behavior (let the request pass through)
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
