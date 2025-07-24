import { listener } from '$lib/server/index.js';
import { resultSchema } from '$lib/server/validation/result-schema';
import { error } from '@sveltejs/kit';

export const POST = async ({ request }) => {
    const parseResult = await resultSchema.safeParseAsync(await request.json());

    if (!parseResult.success) {
        return error(400, parseResult.error.message);
    }

    const { uuid, content } = parseResult.data;

    try {
        listener.addResult(uuid, content);
    } catch { 
        // DEV ONLY DELETE LATER
        console.log(`Container with uuid: ${uuid} tried to resolve awaited result but failed`)
    }

    // ? Sending feedback information back to the container is pointless as it doesn't need to process anything more.
    // ? If the request wasn't made by a container we can still ignore the feedback as this person shouldn't have made the request

    return new Response();
}