import { DATABASE_URL } from "$env/static/private";
import { PrismaClient } from "./generated/prisma/client";

export const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL
});;