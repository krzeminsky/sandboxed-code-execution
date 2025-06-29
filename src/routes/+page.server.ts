import { prisma } from '$lib/server/prisma.js';
import { fail, redirect, type Cookies } from '@sveltejs/kit';
import bcrypt from "bcrypt";
import { signToken } from '$lib/server/token.js';

export const actions = {
    login: async ({ request, cookies }) => {
        const data = await request.formData();

        const username = data.get('username') as string;
        const password = data.get('password') as string;

        // ? Too lazy to implement proper form validation

        if (!username || !password) {
            return fail(400);
        }

        const user = await prisma.user.findUnique({
            where: {
                name: username
            },

            select: {
                password: true
            }
        });

        if (!user) {
            return fail(400)
        }

        if (!await bcrypt.compare(password, user.password)) {
            return fail(400)
        }

        try {
            await signAndSetCookie(username, cookies);
        } catch {
            return fail(400)
        }

        throw redirect(302, "/problem-list")
    },

    register: async ({ request, cookies }) => {
        const data = await request.formData();

        const username = data.get('username') as string;
        const password = data.get('password') as string;

        // ! Unsafe
        // ? Too lazy to implement proper form validation

        if (!username || !password) {
            return fail(400);
        }

        const res = await prisma.user.findUnique({
            where: {
                name: username
            },

            select: {
                id: true
            }
        });

        if (res) {
            return fail(400);
        }

        const hash = await bcrypt.hash(password, 4);

        await prisma.user.create({
            data: {
                name: username,
                password: hash
            }
        });

        try {
            await signAndSetCookie(username, cookies);
        } catch {
            return fail(400)
        }

        throw redirect(302, "/problem-list");
    }
}

async function signAndSetCookie(username: string, cookies: Cookies) {
    const token = await signToken(username).catch(() => {
        throw new Error("Failed to sign token");
    });

    cookies.set('token', token, { maxAge: 3600, path: "/" });
}