import {User} from "../types";
import {createHmac, randomBytes} from "node:crypto";

const Regexes = {
    spaceAndSlashes: /(\s)|(\/)|(\\)/,
    specialCharacter: /[^a-zA-Z0-9\s]/,
    uppercaseLetter: /[A-Z]/,
    lowercaseLetter: /[a-z]/,
    number: /[0-9]/,
    repeatingCharacters: /(.)\1\1/,
} as const;

export function createSessionID() {
    return randomBytes(16).toString("base64");
}

export function createSignatureToken(sessionID: string, secret: string, user: User) {
    return new Bun.CryptoHasher("sha256")
        .update(secret)
        .update(sessionID)
        .update(user.username)
        .digest("base64");
}

export function validatePassword(password: string) {
    if (password.match(Regexes.spaceAndSlashes)) {
        return new Error("Password must not contain spaces or slashes");
    }

    if (!password.match(Regexes.uppercaseLetter) ||
        !password.match(Regexes.lowercaseLetter) ||
        !password.match(Regexes.number) ||
        !password.match(Regexes.specialCharacter)) {
        return new Error("Password must contain at least one uppercase letter, lowercase letter, number and special character");
    }

    if (password.match(/(.)\1\1/)) {
        return new Error("Password must not contain repeating characters more than 3 times");
    }

    return null;
}

export function validateUsername(username: string) {
    if (username.match(Regexes.specialCharacter)) {
        return new Error("Username must not contain any special characters");
    }

    if (username.match(Regexes.spaceAndSlashes)) {
        return new Error("Username must not contain spaces");
    }

    return null;
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


