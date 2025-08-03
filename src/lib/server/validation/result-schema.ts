import z from "zod";

export const resultSchema = z.object({
    uuid: z.string().nonempty(),
    content: z.object({
        success: z.literal(true),
        data: z.any().nonoptional()
    }).or(z.object({
        success: z.literal(false),
        error: z.string().nonempty()
    }))
});

export type ContainerResult = (z.infer<typeof resultSchema>)["content"];