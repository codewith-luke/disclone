import {createSessionID, createSignatureToken, passwordMatches} from "../core/auth";
import {IAuthDB} from "../access/db-access";
import {ValidationError} from "../error";


export function createUserAccess(db: IAuthDB) {
    return {
        loginUser: async function loginUser(username: string, password: string) {
            let user = await db.userAccess.getUser(username);

            if (!user || !passwordMatches(password, user.password)) {
                throw new ValidationError();
            }

            const sessionID = createSessionID(user);
            const token = createSignatureToken(user);

            await db.userAccess.saveSession(sessionID, token);

            return {
                sessionID,
                token
            }
        }
    }
}
