import {User} from "../types";
import {randomBytes} from "node:crypto";

export function createSessionID() {
    return randomBytes(16).toString("base64");
}

export function createSignatureToken(secret: string, user: User) {
    return new Bun.CryptoHasher("sha256")
        .update(secret)
        .update(user.username)
        .digest("base64");
}

export async function hashPassword(password: string) {
    return await Bun.password.hash(password, {
        algorithm: "argon2id",
    });
}

export async function passwordMatches(password: string, hash: string) {
    try {
        return await Bun.password.verify(password, hash, "argon2id");
    } catch (e) {
        return false;
    }
}

