import {sleep} from "bun";
import {UserWithAuth} from "../types";
import {CustomError} from "../error";

type UserAccess = ReturnType<typeof createUserAccess>;

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

function createUserAccess(logger: any) {
    return {
        getUser,
        getPermissions,
        saveSession
    }

    async function getUser(username: string) {
        // TODO: fetch some user from the DB with password
        const user = {
            id: 1,
            username: "johndoe",
            email: "test@test.com",
            password: "securepassword",
            permissions: ["read", "write"]
        } as UserWithAuth;

        await sleep(200);

        logger.info("This is from winton");
        throw new CustomError("Custom implemented");
        return user;
    }

    async function getPermissions() {
        await sleep(200);
        return ["read", "write"]
    }

    async function saveSession(sessionID: string, token: string) {
        await sleep(200);
    }
}

