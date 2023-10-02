import {afterAll, beforeAll, describe, expect, it} from 'bun:test'
import {Elysia} from "elysia";
import {Environments, Routes} from "./types";
import {createApp} from "./server";
import {HttpErrorMessages} from "./util/error";
import {createTestDB, deleteAllUsersBesidesAdmin, deleteUser} from "./scripts/delete-user";

const domain = "http://localhost";

describe("dsa", () => {
    const dbAccess = createTestDB();
    let sut = createApp();

    beforeAll(() => {
        Bun.env.NODE_ENV = Environments.development;
        Bun.env.PASSWORD_PEPPER = "pepper";
        sut.listen(Bun.env.PORT);
    });

    afterAll(function () {
        sut.stop();
        dbAccess.dbConn.end();
        deleteAllUsersBesidesAdmin()
    });

    it(`[${Routes.heartbeat}] return an ok in response`, async () => {
        const expected = "ok";

        const actual = await sut.handle(
            new Request(`${domain}${Routes.heartbeat}`)
        ).then(res => res.text());

        expect(actual).toBe(expected);
    });

    describe(`[${Routes.register}]`, function () {
        it(`should return 400 if invalid email`, async () => {
            const expected = {
                status: 400,
            }

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

            expect(actual.status).toBe(expected.status);
        });

        it(`should return 400 if invalid password`, async () => {
            const expected = {
                status: 400,
            }

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

            expect(actual.status).toBe(expected.status);
        });

        it(`should return 400 if invalid username`, async () => {
            const expected = {
                status: 400,
                message: "Username must not contain any special characters"
            }

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

            expect(actual.status).toBe(expected.status);
            expect(actual?.body?.message).toBe(expected.message);
        });

        it(`should run a user through a registration and archive process`, async () => {
            const expected = {
                username: "test1",
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

            expect(userResult?.username).toEqual(expected.username);
            expect(cookies.includes("session_id")).toBeTrue();
            expect(registerResult.token).toBeDefined();
            expect(registerResult.username).toEqual(expected.username);

            const archiveResult = await sut.handle(
                new Request(`${domain}${Routes.archive}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userID: userResult?.id,
                    }),
                })
            ).then((res: Response) => res.json());

            const archivedUser = await dbAccess.authDB.userAccess.getUser(expected.username);

            expect(archiveResult.userID).toEqual(userResult?.id);
            expect(archivedUser?.archived).toBeTrue();
        });
    });

    describe(`${Routes.login} and ${Routes.logout}`, function () {
        it(`[${Routes.login}] error on invalid user`, async () => {

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

        it(`[${Routes.login}] return a user in response`, async () => {
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
            expect(actual.token).toBeDefined();

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
    });
});