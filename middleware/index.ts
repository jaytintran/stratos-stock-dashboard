import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);

	if (!sessionCookie) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

// Configure which requests this middleware should handle
export const config = {
	// Run this middleware on most routes, but exclude:
	// - /api/* (API routes)
	// - /_next/static/* (CSS, JS files)
	// - /_next/image/* (optimized images)
	// - *.png files (static images)
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)",
	],
};
