import { DATABASE_URL } from "$env/static/private";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { dev } from "$app/environment";

export const db = drizzle<typeof schema>({ connection: DATABASE_URL, schema });

if (dev) {
    if (await db.$count(schema.problemsTable) === 0) {
        await problem1();
        await problem2();
    }
}

async function problem1() {
    let data = "";
    let sum = 0;

    for (let i = 0; i < 1000; i++) {
        const num = Math.round(Math.random() * 1000);
        sum += num;
        data += num + "\n"
    }

    await db.insert(schema.problemsTable).values({
        name: "Average of numbers",
        description: "File 'data.txt' contains 1000 numbers, each in a new line. Create a function 'solution' that returns the average of those numbers rounded to 2 digits",
        data,
        answer: {
            content: Number((sum / 1000).toFixed(2))
        }
    });
}

async function problem2() {
    const alphabet = "qwertyuiopasdfghjklzxcvbnm";
    
    let data = "";
    let answer = "";

    for (let i = 0; i < 1000; i++) {
        const letter = alphabet[randomInt(0, alphabet.length)]
        data += letter + "\n";
        answer += letter;
    }

    await db.insert(schema.problemsTable).values({
        name: "Joined lines",
        description: "File 'data.txt' contains 1000 letters, each in a new line. Create a function 'solution' that returns all letters joined together",
        data,
        answer: {
            content: answer
        }
    })
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}