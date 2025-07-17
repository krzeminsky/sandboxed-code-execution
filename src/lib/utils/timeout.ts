export function createTimeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}