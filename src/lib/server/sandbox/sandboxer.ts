import { db } from "$lib/server/database/drizzle";
import { eq } from "drizzle-orm";
import type { ResultListener } from "./result-listener";
import { problemsTable } from "$lib/server/database/schema";
import { API_URL, CODE_MEMORY_LIMIT, CODE_TIMEOUT, CONTAINER_NAME } from "$env/static/private";
import { spawn } from "child_process";
import { UserDirectory } from "./user-directory";
import type { Problem } from "$lib/server/database/schema-types";

export class Sandboxer {
    #listener: ResultListener;

    constructor(listener: ResultListener) {
        this.#listener = listener;
    }

    async run(userSolution: string, problemId: number) {
        const problem = await db.query.problemsTable.findFirst({
            where: eq(problemsTable.id, problemId),
            columns: {
                answer: true,
                data: true
            }
        });

        if (!problem) {
            throw new Error(`Problem with id: ${problemId} is missing`);
        }

        const uuid = this.#listener.subscribe();
        const userDir = await UserDirectory.create(uuid, problem.data, userSolution);

        try {

            await this.#sandboxCode(uuid, userDir);

            const result = await this.#listener.awaitResult(uuid);

            return this.#judge(result, problem.answer);

        } finally {

            this.#listener.unsubscribe(uuid);
            await userDir.dispose();
        
        }
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

    #sandboxCode(uuid: string, dir: UserDirectory) {        
        return new Promise<void>((resolve, reject) => {
            const container = spawn(
                "docker",
                `run --memory=${CODE_MEMORY_LIMIT} --read-only --rm -v ${dir.tmpDir}:/mnt -e UUID=${uuid} -e API_URL=${API_URL} --network=host --name ${uuid} ${CONTAINER_NAME}`.split(" ")
            )

            container.stderr.on('data', (d: Buffer) => {
                const output = d.toString();

                for (let i = output.length - 2; i >= 0; i--) {
                    if (output[i] == "\n") {
                        reject(output.slice(i + 1, output.length - 1))
                    }
                }
            });

            setTimeout(() => {
                if (!container.killed) {
                    container.kill();
                    reject("Container timed out");
                }
            }, Number(CODE_TIMEOUT));

            container.on('close', () => {
                resolve();
            });
        });
    }
}