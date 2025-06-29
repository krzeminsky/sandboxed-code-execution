import { verifyToken } from '$lib/server/token.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
    const token = cookies.get('token') ?? "asdsa";

    if (!token) {
        throw redirect(302, "/")
    }

    await verifyToken(token).catch(() => {
        throw redirect(302, "/")
    });
}