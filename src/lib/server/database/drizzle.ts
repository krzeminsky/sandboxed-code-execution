import { DATABASE_URL } from "$env/static/private";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { dev } from "$app/environment";

export const db = drizzle<typeof schema>({ connection: DATABASE_URL, schema });

if (dev) {
    if (await db.$count(schema.problemsTable) === 0) {
        const r = await db.insert(schema.problemsTable).values({
            name: "Example problem",
            description: "This is an example problem",
            
            answer: {
                content: 67
            },

            data: "69",
        }).returning()

        console.log(`Created problem record id: ${r[0].id}`)
    }
}
