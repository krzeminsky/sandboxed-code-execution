import z from "zod";

export const resultSchema = z.object({
    uuid: z.string().nonempty(),
    content: z.any().nonoptional()
});