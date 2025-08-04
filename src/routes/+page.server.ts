import { db } from '$lib/server/database/drizzle.js';
import { usersTable } from '$lib/server/database/schema.js';
import { authSchema } from '$lib/server/validation/auth-schema.js'
import { error, redirect, type Cookies } from '@sveltejs/kit';
import { count, eq } from 'drizzle-orm';
import bcrypt from "bcryptjs";
import { getJwtCookie, setJwtCookie, signToken, verifyToken } from '$lib/server/utils/jwt.js';

export const load = async ({ cookies }) => {
    const tokenCookie = getJwtCookie(cookies);
    if (!tokenCookie) return;

    const token = await verifyToken<object>(tokenCookie).catch(() => undefined);

    if (token) {
        throw redirect(302, "/problem-list");
    }
}

export const actions = {
    register: async ({ request, cookies }) => {
        const parsed = await parseFormData(request);

        if (!parsed.success) {
            return error(400, parsed.error.message);
        }

        const { username, password } = parsed.data;

        const userQueryRes = (await db.select({ count: count() }).from(usersTable).where(eq(usersTable.username, username)))[0];
        
        if (userQueryRes.count > 0) {
            return error(400, "User with this username already exists");
        }

        const hashed = await bcrypt.hash(password, 10);

        await db.insert(usersTable).values({
            username,
            password: hashed
        });

        await sendTokenAndRedirect(username, cookies);
    },

    login: async ({ request, cookies }) => {
        const parsed = await parseFormData(request);

        if (!parsed.success) {
            return error(400, parsed.error.message);
        }

        const { username, password } = parsed.data;

        const user = await db.query.usersTable.findFirst({
            where: eq(usersTable.username, username)
        });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return error(400, "Username and password do not match");
        }

        await sendTokenAndRedirect(username, cookies);
    }
}

async function parseFormData(request: Request) {
    return await authSchema.safeParseAsync(Object.fromEntries(await request.formData()));
}

async function sendTokenAndRedirect(username: string, cookies: Cookies) {
    const token = await signToken({ username });
    setJwtCookie(token, cookies);

    throw redirect(302, "/problem-list");
}