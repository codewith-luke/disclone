import {afterAll, beforeAll, describe, expect, it} from 'bun:test'
import {Elysia} from "elysia";
import {Environments, Routes} from "./types";
import {createApp} from "./server";
import {HttpErrorMessages} from "./util/error";
import {createTestDB, deleteAllUsersBesidesAdmin} from "./scripts/delete-user";

const domain = "http://localhost";

describe("dsa", () => {
    const dbAccess = createTestDB();
    let sut = createApp();

    beforeAll(() => {
        deleteAllUsersBesidesAdmin();
        sut.listen(Bun.env.PORT);
    });

    afterAll(function () {
        sut.stop();
        dbAccess.dbConn.end();
        deleteAllUsersBesidesAdmin();
    });

    it(`[${Routes.heartbeat}] return an ok in response`, async () => {
        const expected = "ok";

        const actual = await sut.handle(
            new Request(`${domain}${Routes.heartbeat}`)
        ).then(res => res.text());

        expect(actual).toBe(expected);
    });

    describe(`[${Routes.register}]`, function () {
        afterAll(() => {
            deleteAllUsersBesidesAdmin();
        });

        it(`should return 400 if invalid email`, async () => {
            const actual = await sut.handle(
                new Request(`${domain}${Routes.register}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: "test",
                        password: "securepassword",
                        email: "test!@"
                    }),
                })
            ).then(res => res.json());

            expect(actual.status).toBe(HttpErrorMessages.PARSE.status);
        });

        it(`should return 400 if invalid password`, async () => {
            const actual = await sut.handle(
                new Request(`${domain}${Routes.register}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: "test",
                        password: "short",
                        email: "test@test"
                    }),
                })
            ).then(res => res.json());

            expect(actual.status).toBe(HttpErrorMessages.PARSE.status);
        });

        it(`should return 400 if invalid username`, async () => {
            const expected = "Username must not contain any special characters"

            const actual = await sut.handle(
                new Request(`${domain}${Routes.register}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: "tes!t",
                        password: "test!221T",
                        email: "test@test.com"
                    }),
                })
            ).then(res => res.json());

            expect(actual.status).toBe(HttpErrorMessages.PARSE.status);
            expect(actual?.body?.message).toBe(expected);
        });

        it(`should run a user through a registration and archive process`, async () => {
            const expected = {
                archived: false,
                email: "test@test.com",
                id: 9,
                username: "test1"
            }

            let cookies = "";

            // 1) Register user
            const registerResult = await sut.handle(
                new Request(`${domain}${Routes.register}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: "test1",
                        password: "test!221T",
                        email: "test@test.com"
                    }),
                })
            ).then((res: Response) => {
                cookies = res.headers.get("Set-Cookie") ?? "";
                return res.json();
            });

            const userResult = await dbAccess.authDB.userAccess.getUser(expected.username);

            expect(cookies.includes("session_id")).toBeTrue();
            expect(cookies.includes("session_token")).toBeTrue();

            const {user} = registerResult;
            expect(user.username).toEqual(expected.username);
            expect(user.email).toEqual(expected.email);
            expect(user.archived).toBeFalse();

            // 2) Archive user
            const archiveResult = await sut.handle(
                new Request(`${domain}${Routes.archive}`, {
                    method: 'PUT',
                    headers: {
                        'Cookie': cookies,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userID: userResult?.id,
                    }),
                })
            ).then((res: Response) => res.json());

            expect(archiveResult.userID).toEqual(user.id);

            // 3) Check if user is archived
            const archivedUser = await dbAccess.authDB.userAccess.getUser(expected.username);
            expect(archivedUser?.archived).toBeTrue();
        });

        it(`should not allow archiving of another user`, async () => {
            let cookies = "";

            // 1) Register user
            const registerResult = await sut.handle(
                new Request(`${domain}${Routes.register}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: "test2",
                        password: "test!221T",
                        email: "test2@test.com"
                    }),
                })
            ).then((res: Response) => {
                cookies = res.headers.get("Set-Cookie") ?? "";
                return res.json();
            });

            // 2) Archive admin user
            const archiveResult = await sut.handle(
                new Request(`${domain}${Routes.archive}`, {
                    method: 'PUT',
                    headers: {
                        'Cookie': cookies,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userID: 1,
                    }),
                })
            ).then((res: Response) => res.json());

            expect(archiveResult.status).toBe(HttpErrorMessages.VALIDATION.status);

            // 3) Check if user is archived
            const archivedUser = await dbAccess.authDB.userAccess.getUser("admin");
            expect(archivedUser?.archived).toBeFalse();
        });
    });

    describe(`${Routes.login} and ${Routes.logout}`, function () {
        it(`should error on invalid user`, async () => {
            const actual = await sut.handle(
                new Request(`${domain}${Routes.login}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: "invalidUser",
                        password: "securepassword",
                    }),
                })
            )

            expect(actual.status).toBe(HttpErrorMessages.VALIDATION.status);
        });

        it(`should login and set a cookie and logout, while clearing the session`, async () => {
            let cookies = "";

            const actual = await sut.handle(
                new Request(`${domain}${Routes.login}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: "admin",
                        password: "admin",
                    }),
                })
            ).then((res: Response) => {
                cookies = res.headers.get("Set-Cookie") ?? "";
                return res.json();
            });

            expect(cookies.includes("session_id")).toBeTrue();

            await sut.handle(
                new Request(`${domain}${Routes.logout}`, {
                    method: 'POST',
                    headers: {
                        'Cookie': cookies,
                    }
                })
            ).then(res => {
                cookies = res.headers.get("Set-Cookie") ?? "";
            });
            const user = await dbAccess.authDB.userAccess.getUser("admin");
            const session = await dbAccess.authDB.userAccess.sessionByUserID(user?.id ?? -1);

            const sessionID = cookies.split('; ')
                .find(row => row.startsWith("session_id="))?.split('=')[1] || "";

            expect(session).not.toBeDefined();
            expect(sessionID.length).toBe(0);
        });

        it(`should login and retrieve user`, async () => {
            const expected = 'admin';
            let cookies = "";

            await sut.handle(
                new Request(`${domain}${Routes.login}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: "admin",
                        password: "admin",
                    }),
                })
            ).then((res: Response) => {
                cookies = res.headers.get("Set-Cookie") ?? "";
                return res.json();
            });

            const actual = await sut.handle(
                new Request(`${domain}${Routes.me}`, {
                    method: 'GET',
                    headers: {
                        'Cookie': cookies,
                    }
                })
            ).then((res: Response) => {
                return res.json();
            });

            expect(actual.username).toEqual(expected);
        });
    });
});