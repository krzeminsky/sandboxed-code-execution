import { deleteJwtCookie } from '$lib/server/utils/jwt.js';
import { redirect } from '@sveltejs/kit'

export const GET = async ({ cookies }) => {
    deleteJwtCookie(cookies);

    throw redirect(302, "/");
}