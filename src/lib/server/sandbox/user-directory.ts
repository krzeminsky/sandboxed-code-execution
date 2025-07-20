import fs from "fs/promises";

export class UserDirectory {
    #uuid: string;
    #initialized = false;
    #tmpDir: string;

    constructor(uuid: string) {
        this.#uuid = uuid;
        this.#tmpDir = `./tmp/${uuid}`
    }

    get tmpDir() {
        return this.#tmpDir;
    }

    static async create(uuid: string, data: string, solution: string) {
        const dir = new UserDirectory(uuid);

        await fs.mkdir(dir.#tmpDir);
        await fs.writeFile(`${dir.#tmpDir}/data.txt`, data);
        await fs.writeFile(`${dir.#tmpDir}/user_solution.py`, solution);

        dir.#initialized = true;

        return dir;
    }
    
    async dispose() {
        if (this.#initialized) {
            throw new Error("User directory is not initialized. Create UserDirectory with create() static function.")
        }

        await fs.rm(`./tmp/${this.#uuid}`, { recursive: true, force: true });

        this.#initialized = false;
    }
}