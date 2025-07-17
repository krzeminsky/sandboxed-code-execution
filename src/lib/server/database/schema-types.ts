import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { usersTable, problemsTable, userSolutions } from "./schema";

export type User = InferSelectModel<typeof usersTable>;
export type UserInsert = InferInsertModel<typeof usersTable>

export type Problem = InferSelectModel<typeof problemsTable>;
export type ProblemInsert = InferInsertModel<typeof problemsTable>;

export type UserSolution = InferSelectModel<typeof userSolutions>;
export type UserSolutionInsert = InferInsertModel<typeof userSolutions>