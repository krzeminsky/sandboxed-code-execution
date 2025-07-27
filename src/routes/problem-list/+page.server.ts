import { PROBLEMS_PER_PAGE } from '$env/static/private';
import { db } from '$lib/server/database/drizzle.js';
import { problemsTable } from '$lib/server/database/schema.js';

export const load = async ({ url }) => {
    const page = Number(url.searchParams.get("page"));
    const problemsPerPage = Number(PROBLEMS_PER_PAGE);

    const result = await db.select({
        id: problemsTable.id,
        name: problemsTable.name
    }).from(problemsTable).limit(problemsPerPage).offset(page * problemsPerPage);

    return { result };
}