import { db } from '$lib/server/database/drizzle';

export const handle = async ({ resolve, event }) => {
    return resolve(event);
}