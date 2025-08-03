import z from "zod";

export const solutionSchema = z.object({
    id: z.int().positive(),
    solution: z.string().nonempty()
});