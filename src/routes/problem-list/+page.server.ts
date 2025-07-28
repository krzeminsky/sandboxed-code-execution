import { PROBLEMS_PER_PAGE } from '$env/static/private';
import { db } from '$lib/server/database/drizzle.js';
import { problemsTable } from '$lib/server/database/schema.js';

export const load = async () => {
    const result = await db.select({
        id: problemsTable.id,
        name: problemsTable.name
    }).from(problemsTable);

    return { result };
}