import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/show(.*)']);

console.log("middleware loaded");

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();
    if (isPublicRoute(req)) {
        if (userId) {
            return NextResponse.redirect(new URL('/', req.url));
        }
        return
    };

    if (!userId) {
        return NextResponse.redirect(new URL('/show', req.url));
    }
});

export const config = {
    matcher: [
        // Run middleware on all app routes except static files
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Optionally protect API routes
        '/(api|trpc)(.*)',
    ],
};
