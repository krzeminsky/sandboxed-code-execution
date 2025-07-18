import { db } from "../database/drizzle";
import { eq } from "drizzle-orm";
import { problemsTable } from "../database/schema";
import type { ResultListener } from "./result-listener";
import { v7 } from "uuid";
import { createTimeout } from "$lib/utils/timeout";
import { CODE_MEMORY_LIMIT, CODE_TIMEOUT, CONTAINER_NAME, PORT } from "$env/static/private";
import fs from "fs/promises";
import { spawn } from "child_process";
import type { Problem } from "../database/schema-types";

export class Sandboxer {    
    #listener: ResultListener;
    
    constructor(listener: ResultListener) {
        this.#listener = listener;
    }

    async run(solution: string, problemId: number) {
        const problem = await db.query.problemsTable.findFirst({
            columns: {
                data: true,
                answer: true
            },
            where: eq(problemsTable.id, problemId)
        });

        if (!problem) {
            throw new Error("Problem data is missing");
        }

        const uuid = v7();

        const timeout = createTimeout(Number(CODE_TIMEOUT));
        const resultPromise = this.#listener.result(uuid, timeout);

        await this.#runContainer(uuid, problem.data, solution, timeout);

        const result = await resultPromise;

        return this.#judge(result, problem.answer);
    }

    #judge(result: any, problemAnswer: Problem["answer"]) {
        const resultType = typeof result;
        const expectedType = typeof problemAnswer.content;

        if (resultType !== expectedType) {
            throw new Error(`Expected result type: ${expectedType}, but received: ${resultType}`)
        }

        const constructVerdict = (v: boolean) => ({
            verdict: v,
            receivedOutput: result,
            expectedOutput: problemAnswer.content
        });

        if (Array.isArray(problemAnswer.content)) {
            if (!Array.isArray(result)) {
                throw new Error(`Expected an array but received an object`);
            }

            const answerArr = problemAnswer.content as any[];
            const resultArr = result as any[];

            if (answerArr.length !== resultArr.length) {
                return constructVerdict(false);
            }

            if (!problemAnswer.ignoreArrayOrder) {
                for (let i = 0; i < answerArr.length; i++) {
                    if (answerArr[i] !== resultArr[i]) {
                        return constructVerdict(false);
                    }
                }
            }

            return constructVerdict(true);
        }

        return constructVerdict(result === problemAnswer.content);
    }

    async #runContainer(uuid: string, data: string, solution: string, timeout: Promise<any>) {
        const tmpPath = `./tmp/${uuid}`;
        
        await fs.writeFile(`${tmpPath}/data.txt`, data);
        await fs.writeFile(`${tmpPath}/user_solution.py`, solution);

        const promise = new Promise<void>(async (resolve, reject) => {
            const container = spawn(
                "docker",
                `run --memory=${CODE_MEMORY_LIMIT} --read-only -rm -v ${tmpPath}:/mnt -e UUID=${uuid}, -e PORT=${PORT} --name ${uuid} ${CONTAINER_NAME}`.split(" ")
            );

            let alive = true;

            timeout.then(() => {
                reject("Timed out")

                if (alive) {
                    container.kill();
                }
            })

            container.stderr.on('data', (d: Buffer) => {
                const output = d.toString();

                for (let i = output.length - 2; i >= 0; i--) {
                    if (output[i] == "\n") {
                        return reject(output.slice(i + 1, output.length - 1))
                    }
                }
            })

            container.on('close', () => {
                alive = false;
                resolve();
            })
        });

        promise.finally(() => {
            fs.rm(tmpPath, { recursive: true, force: true });
        });

        return promise;
    }
}