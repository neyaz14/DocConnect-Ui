import jwt, { JwtPayload } from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
    getDefaultDashboardRoute,
    getRouteOwner,
    isAuthRoute,
    UserRole,
} from './lib/auth-utils';
import { deleteCookie, getCookie } from './services/auth/tokenHandlers';

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const accessToken = await getCookie('accessToken');
    let userRole: UserRole | null = null;

    // 🔐 STEP 1: Token verify (SAFE)
    if (accessToken) {
        try {
            const decoded = jwt.verify(
                accessToken,
                process.env.JWT_SECRET as string
            ) as JwtPayload;

            userRole = decoded.role as UserRole;
        } catch (error) {
            // ❌ Invalid / expired token
            await deleteCookie('accessToken');
            await deleteCookie('refreshToken');

            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            console.log(error);

            return NextResponse.redirect(loginUrl);
        }
    }

    const routeOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    // 🔁 Rule 1: Logged-in user → auth page
    if (accessToken && isAuth) {
        return NextResponse.redirect(
            new URL(getDefaultDashboardRoute(userRole!), request.url)
        );
    }

    // 🌍 Rule 2: Public route
    if (routeOwner === null) {
        return NextResponse.next();
    }

    // 🔒 Rule 3: Not logged in
    if (!accessToken) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 🧑‍🤝‍🧑 Rule 4: Common protected
    if (routeOwner === 'COMMON') {
        return NextResponse.next();
    }

    // 🧠 Rule 5: Role-based
    if (userRole !== routeOwner) {
        return NextResponse.redirect(
            new URL(getDefaultDashboardRoute(userRole!), request.url)
        );
    }

    return NextResponse.next();
}