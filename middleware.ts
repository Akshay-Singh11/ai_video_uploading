import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";


export default withAuth(
    function middleware() {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized({ token, req }) {
                const { pathname } = req.nextUrl;
                if(
                    pathname.startsWith("/api/auth") ||
                    pathname === "/login" ||
                    pathname === "/register"

                ){
                    return true;
                }
                if(pathname === "/" || pathname.startsWith("/api/video")){
                    return true;
                }
                return !!token;
            }
        },
    }
);

export const config = {
    matcher: ["/admin/:path*"],
};

// export const config ={
//     /*
//     * Match all request paths except for the ones starting with:
//     * - api (API routes)
//     * - _next/static (static files)
//     * - _next/image (image optimization files)
//     * - favicon.ico (favicon file)
//     * - public (public files)
//     * - login (login page)
//     * - register (register page)
//     * - api/auth (auth routes)
//     */
// }