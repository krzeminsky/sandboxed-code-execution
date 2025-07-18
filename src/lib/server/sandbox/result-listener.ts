export class ResultListener {
    #subscribers = new Map<string, (arg: any) => void>();

    resolve(uuid: string, result: any) {
        const sub = this.#subscribers.get(uuid);

        if (!sub) {
            throw new Error("Uuid timed out");
        }

        sub(result);
        this.#subscribers.delete(uuid);
    }

    result(uuid: string, timeout: Promise<any>) {
        const { promise, resolve, reject } = Promise.withResolvers<any>();

        this.#subscribers.set(uuid, resolve);

        timeout.then(() => {
            reject("Timed out");
            this.#subscribers.delete(uuid);
        })

        return promise;
    }
}