import { sandboxer } from '$lib/server/index.js';
import { judgeSchema } from '$lib/server/validation/judge-schema.js';
import { error } from '@sveltejs/kit';

export const POST = async ({ request }) => {
    const parseResult = await judgeSchema.safeParseAsync(await request.json())

    if (!parseResult.success) {
        return error(400, parseResult.error.message);
    }

    const { problemId, solution } = parseResult.data;

    try {
        const verdict = await sandboxer.run(solution, problemId);

        return new Response(JSON.stringify(verdict));
    } catch (caughtError) {
        const errorCast = caughtError as Error;
        console.log(caughtError);

        return error(400, errorCast.message);
    }
}