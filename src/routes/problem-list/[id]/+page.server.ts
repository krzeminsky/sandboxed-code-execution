import { db } from '$lib/server/database/drizzle.js'
import { problemsTable, userSolutions } from '$lib/server/database/schema.js'
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm'

export const load = async ({ locals, params }) => {
    const problemId = Number(params.id);
    const username = locals.username!;

    if (isNaN(problemId)) throw redirect(302, "/problem-list");
    
    const problem = await db.query.problemsTable.findFirst({
        where: eq(problemsTable.id, problemId),
        columns: {
            id: true,
            name: true,
            description: true,
            data: true
        },

        with: {
            solutions: {
                where: eq(userSolutions.username, username),
                columns: {
                    id: true,
                    solution: true,
                    solved: true
                },
            }
        }
    });

    if (!problem) throw redirect(302, "/problem-list");

    if (problem.solutions.length == 0) {
        problem.solutions = await db.insert(userSolutions).values({
            problemId,
            username,
            solution: "def solution():\n\t",
            solved: false
        }).returning({
            id: userSolutions.id,
            solution: userSolutions.solution,
            solved: userSolutions.solved
        });
    }

    const remapped = {
        id: problem.id,
        name: problem.name,
        description: problem.description,
        data: problem.data,
        solution: problem.solutions[0]
    };

    // Ugly code but drizzle forced my hand

    return { problem: remapped }
}