import {User} from "../core/user";
import {sleep} from "bun";

export async function getPermissions(user: User) {
    await sleep(200);
    return ["read", "write"]
}

export async function saveSession(sessionID: string, token: string) {
    await sleep(200);
}
