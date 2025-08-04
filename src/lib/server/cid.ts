import { SELF_CONTAINER_NAME } from "$env/static/private";
import { execSync } from "child_process"

let cid = "";

export function getCID() {
    if (cid) {
        return cid;
    }

    if (import.meta.env.MODE !== "prod") return "";

    cid = execSync(`docker inspect --format="{{.Id}}" ${SELF_CONTAINER_NAME}`).toString();

    return cid;
}