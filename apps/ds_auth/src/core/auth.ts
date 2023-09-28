import {User} from "../types";
import {createHmac, randomBytes} from "node:crypto";

export function createSessionID() {
    return randomBytes(16).toString("base64");
}

export function createSignatureToken(secret: string, user: User) {
    return new Bun.CryptoHasher("sha256")
        .update(secret)
        .update(new Date().toString())
        .update(user.username)
        .digest("base64");
}

export function validatePassword(password: string) {
    // NOTE: Checks for spaces and slashes
    if (password.match(/(\s)|(\/)|(\\)/)) {
        return new Error("Password must not contain spaces or slashes");
    }

    // NOTE: Checks for special character
    if (!password.match(/[^a-zA-Z0-9\s]/)) {
        return new Error("Password must contain at least one special character");
    }

    // NOTE: Checks for uppercase letter
    if (!password.match(/[A-Z]/)) {
        return new Error("Password must contain at least one uppercase letter");
    }

    // NOTE: Checks for lowercase letter
    if (!password.match(/[a-z]/)) {
        return new Error("Password must contain at least one lowercase letter");
    }

    // NOTE: Checks for number
    if (!password.match(/[0-9]/)) {
        return new Error("Password must contain at least one number");
    }

    // NOTE: Checks for repeating characters
    if (password.match(/(.)\1\1/)) {
        return new Error("Password must not contain repeating characters more than 3 times");
    }
}

export function validateUsername(username: string) {

}

export async function hashPassword(password: string, pepper: string) {
    if (!pepper || pepper.length === 0) {
        throw new Error("Password pepper is missing");
    }

    if (!password || password.length === 0) {
        throw new Error("Password is missing");
    }

    const encryptedPassword = encryptPassword(password, pepper);
    return Bun.password.hash(encryptedPassword);
}

export async function passwordMatches(password: string, hash: string, pepper: string) {
    if (!pepper || pepper.length === 0) {
        throw new Error("Password pepper is missing");
    }

    const encryptedPassword = encryptPassword(password, pepper);
    return await Bun.password.verify(encryptedPassword, hash, "argon2id");
}

// TODO: This needs to be swapped out for some dynamic secret stored in a vault
function encryptPassword(hash: string, pepper: string) {
    return createHmac("sha256", pepper).update(hash).digest("base64");
}


