import { JWT_SECRET } from "$env/static/private";
import type { Cookies } from "@sveltejs/kit";
import jwt from "jsonwebtoken";

const JWT_COOKIE_KEY = "auth_token";

export function signToken(payload: object, expiresIn: number = 60 * 60) {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(payload, JWT_SECRET, { expiresIn }, (err, res) => {
            if (err) {
                return reject(err.message);
            }

            resolve(res!);
        });
    });
}

// probably a security risk. Too bad!
export function setJwtCookie(jwt: string, cookies: Cookies, expiresIn = 60 * 60 * 60) {
    cookies.set(JWT_COOKIE_KEY, jwt, { path: "/", maxAge: expiresIn })
}

export function getJwtCookie(cookies: Cookies) {
    return cookies.get(JWT_COOKIE_KEY);
}

export function deleteJwtCookie(cookies: Cookies) {
    cookies.delete(JWT_COOKIE_KEY, { path: "/" });
}

export function verifyToken<T>(token: string) {
    return new Promise<T>((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, res) => {
            if (err) {
                return reject(err.message);
            }

            resolve(res as T);
        })
    })
}