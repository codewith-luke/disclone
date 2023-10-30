import createDBConn from "../db";
import {createAuthDB} from "../access/db-access";
import {loggers} from "../util/logger";
import {Routes} from "../types";

export async function deleteAllUsersBesidesAdmin() {
    const conn = createDBConn();

    await conn.query.begin(async (query) => {
        await query`
            delete
            from sessions
            where user_id != 1
        `;

        await query`
            DELETE
            FROM users
            WHERE id != 1
        `;
    });

    await conn.end();
}

export function createTestDB() {
    const dbConn = createDBConn();
    const authDB = createAuthDB(loggers.basicLogger, dbConn);

    return {
        dbConn,
        authDB
    }
}