import {sleep} from "bun";
import {UserWithAuth} from "../types";
import {hashPassword} from "../core/auth";
import {type RegisterUserInput} from "../use-cases/user-access";

type UserAccess = ReturnType<typeof createUserAccess>;

type RegisterUserAccess  = {} & RegisterUserInput;

export interface IAuthDB {
    userAccess: UserAccess;
}

export default class AuthDB implements IAuthDB {
    public readonly userAccess;

    constructor(logger: any) {
        // DB GOES HERE
        this.userAccess = createUserAccess(logger);
    }
}

function createUserAccess(logger: Console) {
    return {
        getUser,
        getPermissions,
        saveSession,
        deleteSession,
        registerUser
    }

    async function getUser(username: string) {
        // TODO: fetch some user from the DB with password
        const user = {
            id: 1,
            username: "johndoe",
            email: "test@test.com",
            password: await hashPassword("securepassword"),
            permissions: ["read", "write"]
        } as UserWithAuth;

        await sleep(200);

        return user;
    }

    async function getPermissions() {
        await sleep(200);
        return ["read", "write"]
    }

    async function saveSession(sessionID: string, token: string) {
        await sleep(200);
    }

    async function deleteSession(sessionID: string) {
        await sleep(200);
    }

    async function registerUser({email, username, password}: RegisterUserAccess) {
        await sleep(200);
    }
}

