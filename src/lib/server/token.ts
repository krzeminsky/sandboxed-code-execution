import jwt from "jsonwebtoken"
import { PRIVATE_KEY } from "$env/static/private";

export function signToken(username: string) {
    return new Promise<string>((resolve, reject) => {
        jwt.sign({ username }, PRIVATE_KEY, { expiresIn: '1h' }, (err, res) => {
            if (err) {
                reject("Failed to sign token");
            } else if (res) {
                resolve(res);
            }
        });
    })
}

export function verifyToken(token: string) {
    return new Promise<{ username: string }>((resolve, reject) => {
        jwt.verify(token, PRIVATE_KEY, (err, res) => {
            if (err) {
                reject("Failed to verify token");
            } else if (res) {
                resolve(res as { username: string });
            }
        })
    });
}