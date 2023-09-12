import {sleep} from "bun";
import {UserWithAuth} from "../core/user";

export async function getUser(username: string) {
    // TODO: fetch some user from the DB with password
    const user = {
        id: 1,
        username: "johndoe",
        email: "test@test.com",
        password: "securepassword",
        permissions: ["read", "write"]
    } as UserWithAuth;

    await sleep(200);
    return user;
}


