import { RESULT_TIMEOUT } from "$env/static/private";
import { v7 } from "uuid";
import type { ContainerResult } from "../validation/result-schema";

export class ResultListener {
    #subscribers = new Set<string>();
    #results = new Map<string, ContainerResult>();
    #clients = new Map<string, (arg: ContainerResult) => void>();

    subscribe() {
        const uuid = v7();

        this.#subscribers.add(uuid);

        return uuid;
    }

    unsubscribe(uuid: string) {
        this.#subscribers.delete(uuid);
        this.#results.delete(uuid);
        this.#clients.delete(uuid);
    }

    addResult(uuid: string, result: ContainerResult) {
        if (!this.#subscribers.has(uuid)) {
            throw new Error("Uuid not found");
        }

        const client = this.#clients.get(uuid);

        if (client) {
            return client(result);
        }

        this.#results.set(uuid, result);
    }

    awaitResult(uuid: string) {
        const promise = new Promise<ContainerResult>((resolve, reject) => {
            const result = this.#results.get(uuid);

            if (result) {
                this.#results.delete(uuid);

                return resolve(result);
            }

            this.#clients.set(uuid, resolve);

            setTimeout(() => {
                reject(new Error("Result client timed out"));
            }, Number(RESULT_TIMEOUT));
        });

        return promise;
    }
}