import { z } from "zod";

export const judgeSchema = z.object({
    problemId: z.number().positive(),
    solution: z.string().nonempty()
});