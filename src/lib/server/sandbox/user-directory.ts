import { TMP_PATH } from "$env/static/private";
import fs from "fs/promises";
import path from "path";

export class UserDirectory {
    #uuid: string;
    #initialized = false;
    
    #mountDir: string;
    #localTmpDir: string;

    constructor(uuid: string) {
        this.#uuid = uuid;
        this.#mountDir = path.join(TMP_PATH, uuid);
        this.#localTmpDir = `./tmp/${uuid}`;
    }

    get mountDir() {
        return this.#mountDir;
    }

    static async create(uuid: string, data: string, solution: string) {
        const dir = new UserDirectory(uuid);

        await fs.mkdir(dir.#localTmpDir, { recursive: true });
        await fs.writeFile(`${dir.#localTmpDir}/data.txt`, data);
        await fs.writeFile(`${dir.#localTmpDir}/user_solution.py`, solution);

        dir.#initialized = true;

        return dir;
    }
    
    async dispose() {
        if (!this.#initialized) {
            throw new Error("User directory is not initialized. Create UserDirectory with create() static function.")
        }

        await fs.rm(`./tmp/${this.#uuid}`, { recursive: true, force: true });

        this.#initialized = false;
    }
}