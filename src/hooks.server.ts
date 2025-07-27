import { getJwtCookie, verifyToken } from '$lib/server/utils/jwt';
import { redirect } from '@sveltejs/kit';

const protectedRoutes = [
    "/problem-list",
]

export const handle = async ({ event, resolve }) => {
    if (event.route.id) {
        for (const r of protectedRoutes) {
            if (!event.route.id.startsWith(r)) continue;
            
            const token = getJwtCookie(event.cookies);
            if (!token) {
                throw redirect(302, "/");
            }

            const tokenPayload = await verifyToken<{ username: string }>(token).catch(() => {
                throw redirect(302, "/");
            });

            event.locals.username = tokenPayload.username;

            break;
        }
    }
    
    return await resolve(event);
}