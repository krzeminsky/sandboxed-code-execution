import { db } from '$lib/server/database/drizzle.js';
import { userSolutions } from '$lib/server/database/schema.js';
import { solutionSchema } from '$lib/server/validation/solution-schema.js'
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const POST = async ({ request }) => {
    const parseResult = await solutionSchema.safeParseAsync(await request.json());

    if (!parseResult.success) {
        return error(400, parseResult.error.message);
    }

    try {
        await db.update(userSolutions).set({
            solution: parseResult.data.solution
        }).where(eq(userSolutions.id, parseResult.data.id));
    } catch {
        return error(400, "Failed to save");
    }

    return new Response()
}