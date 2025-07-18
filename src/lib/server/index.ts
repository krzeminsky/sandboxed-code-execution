import { ResultListener } from "./sandbox/result-listener";
import { Sandboxer } from "./sandbox/sandboxer";

export const listener = new ResultListener();
export const sandboxer = new Sandboxer(listener);