import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    if (request.nextUrl.pathname === "/") {
        const lang = request.headers.get('accept-language')?.split(',')[0];
        if (lang?.startsWith('vi')) {
            return Response.redirect(new URL('/vi', request.url));
        } else {
            return Response.redirect(new URL('/en', request.url));
        }
    }
    return intlMiddleware(request);
}

export const config = {
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
