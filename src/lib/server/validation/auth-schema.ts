import z from "zod";

export const authSchema = z.object({
    username: z.string().trim().nonempty(),
    password: z.string().trim().nonempty()
})