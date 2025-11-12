// middleware.js (or middleware.ts)
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

async function verifyToken(token, secret) {
    if (!token) return null;

    try {
        const secretKey = new TextEncoder().encode(secret);
        const { payload } = await jwtVerify(token, secretKey);
        return payload;
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        return null;
    }
}

export async function middleware(req) {
    console.log("Middleware running for:", req.nextUrl.pathname);
    const { pathname } = req.nextUrl;

    // Get token from HttpOnly cookie (secure)
    const adminToken = req.cookies.get("admintoken")?.value;

    // Allow access to login page
    if (pathname.startsWith("/login")) {
        // Optional: redirect logged-in users away from login
        if (adminToken) {
            const payload = await verifyToken(adminToken, process.env.JWT_SECRET);
            if (payload) {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
        }
        return NextResponse.next();
    }

    // Protect dashboard routes
    if (pathname.startsWith("/dashboard")) {
        if (!adminToken) {
            const loginUrl = new URL("/login", req.url);
            loginUrl.searchParams.set("error", "login-required");
            loginUrl.searchParams.set("redirect", pathname); // optional: preserve path
            return NextResponse.redirect(loginUrl);
        }

        const payload = await verifyToken(adminToken, process.env.JWT_SECRET);

        if (!payload) {
            // Clear invalid cookie
            const response = NextResponse.redirect(new URL("/login", req.url));
            response.cookies.delete("admintoken");
            return response;
        }

        // Optional: check role or exp
        // if (payload.role !== 'admin') { ... }

        return NextResponse.next();
    }

    // Allow all other routes
    return NextResponse.next();
}

// Apply to all routes
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - API routes (/api/*)
         * - Static files (_next/static, _next/image, favicon.ico, etc.)
         * - Public assets (optional)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};