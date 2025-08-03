import { relations } from "drizzle-orm";
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
    
    username: p.varchar().references(() => usersTable.username, {
        onDelete: "cascade",
        onUpdate: "cascade"
    }).notNull(),

    problemId: p.integer().references(() => problemsTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade"
    }).notNull(),

    solution: p.text().notNull(),
    solved: p.boolean().notNull()
});



export const userRelations = relations(usersTable, ({ many }) => ({
    solutions: many(userSolutions)
}))

export const solutionRelations = relations(userSolutions, ({ one }) => ({
    user: one(usersTable, {
        fields: [userSolutions.username],
        references: [usersTable.username]
    }),

    problem: one(problemsTable, {
        fields: [userSolutions.problemId],
        references: [problemsTable.id]
    })
}))

export const problemRelations = relations(problemsTable, ({ many }) => ({
    solutions: many(userSolutions)
}))