import * as p from "drizzle-orm/pg-core";

export const usersTable = p.pgTable('Users', {
    id: p.integer().primaryKey().generatedAlwaysAsIdentity(),

    username: p.varchar().unique().notNull(),
    password: p.varchar().notNull()
}, table => [
    p.uniqueIndex("username_idx").on(table.username)
]);

export const problemsTable = p.pgTable('Problems', {
    id: p.integer().primaryKey().generatedAlwaysAsIdentity(),

    name: p.varchar().notNull(),
    description: p.text().notNull(),
    data: p.text().notNull(),

    answer: p.jsonb().$type<{
        content: any,
        ignoreArrayOrder?: boolean
    }>().notNull(),
});

export const userSolutions = p.pgTable('UserSolutions', {
    id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: p.integer().references(() => usersTable.id),
    problemId: p.integer().references(() => problemsTable.id),

    solution: p.text().notNull(),
    solved: p.boolean().notNull()
});