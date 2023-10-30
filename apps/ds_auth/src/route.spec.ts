import {afterAll, beforeAll, beforeEach, describe, expect, it} from 'bun:test'
import {Routes} from "./types";
import {createApp} from "./server";
import {HttpErrorMessages} from "./util/error";
import {createTestDB, deleteAllUsersBesidesAdmin} from "./test-scripts";

const domain = "http://localhost";

const testUser = {
    username: "test1",
    password: "test!221T",
    email: "test@test.com",
    display_name: "test1"
}

function cookieSetter(cookieHeader: string[]) {
    return cookieHeader.reduce((acc, curr) => {
        const [value] = curr.split(';');
        return `${acc}${value};`;
    }, "");
}

async function loginTestUser(sut: any) {
    let cookies = "";

    await sut.handle(
        new Request(`${domain}${Routes.auth.base}${Routes.auth.keys.login}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: testUser.username,
                password: testUser.password,
            }),
        })
    ).then((res: Response) => {
        const cookieHeader = res.headers.getSetCookie();
        cookies = cookieSetter(cookieHeader)
        return res.json();
    });

    return cookies;
}

describe("dsa", () => {
    const dbAccess = createTestDB();
    let sut = createApp();

    beforeAll(() => {
        deleteAllUsersBesidesAdmin();
        sut.listen(Bun.env.PORT);
    });

    afterAll(function () {
        sut.stop();
        deleteAllUsersBesidesAdmin();
        dbAccess.dbConn.end();
    });

    it(`[${Routes.heartbeat}] return an ok in response`, async () => {
        const expected = "ok";

        const {result: actual} = await sut.handle(
            new Request(`${domain}${Routes.heartbeat}`)
        ).then(res => res.json());

        expect(actual).toBe(expected);
    });

    describe(`Registration and archiving process`, function () {
        it(`should return 400 if invalid email`, async () => {
            const {error: actual} = await sut.handle(
                new Request(`${domain}${Routes.auth.base}${Routes.auth.keys.register}`, {
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
            const {error: actual} = await sut.handle(
                new Request(`${domain}${Routes.auth.base}${Routes.auth.keys.register}`, {
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

            const {error: actual} = await sut.handle(
                new Request(`${domain}${Routes.auth.base}${Routes.auth.keys.register}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: "tes!t",
                        password: "test!221T",
                        email: "test@test.com",
                        display_name: "test"
                    }),
                })
            ).then(res => res.json());

            expect(actual.status).toBe(HttpErrorMessages.PARSE.status);
            expect(actual?.message).toBe(expected);
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
            const {result} = await sut.handle(
                new Request(`${domain}${Routes.auth.base}${Routes.auth.keys.register}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...testUser
                    }),
                })
            ).then((res: Response) => {
                const cookieHeader = res.headers.getSetCookie();
                cookies = cookieSetter(cookieHeader)
                return res.json();
            });

            const userResult = await dbAccess.authDB.userAccess.getUser(expected.username);

            expect(cookies.includes("session_id")).toBeTrue();
            expect(cookies.includes("session_token")).toBeTrue();

            const {user} = result;
            expect(user.username).toEqual(expected.username);
            expect(user.email).toEqual(expected.email);
            expect(user.archived).toBeFalse();

            // 2) Archive user
            const {result: archiveResult} = await sut.handle(
                new Request(`${domain}${Routes.profile.base}${Routes.profile.keys.archive}`, {
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
            const user = await sut.handle(
                new Request(`${domain}${Routes.auth.base}${Routes.auth.keys.register}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: "test2",
                        password: "test!221T",
                        email: "test2@test.com",
                        display_name: "test2"
                    }),
                })
            ).then((res: Response) => {
                const cookieHeader = res.headers.getSetCookie();
                cookies = cookieSetter(cookieHeader)
                return res.json();
            });

            // 2) Archive testuser user
            const {error: archiveResult} = await sut.handle(
                new Request(`${domain}${Routes.profile.base}${Routes.profile.keys.archive}`, {
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
            const archivedUser = await dbAccess.authDB.userAccess.getUser("test2");
            expect(archivedUser?.archived).toBeFalse();
        });
    });

    describe(`Login logout process`, function () {
        it(`should error on invalid user`, async () => {
            const actual = await sut.handle(
                new Request(`${domain}${Routes.auth.base}${Routes.auth.keys.login}`, {
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

            await sut.handle(
                new Request(`${domain}${Routes.auth.base}${Routes.auth.keys.login}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: testUser.username,
                        password: testUser.password,
                    }),
                })
            ).then((res: Response) => {
                const cookieHeader = res.headers.getSetCookie();
                cookies = cookieSetter(cookieHeader)
                return res.json();
            });

            expect(cookies.includes("session_id")).toBeTrue();

            await sut.handle(
                new Request(`${domain}${Routes.auth.base}${Routes.auth.keys.logout}`, {
                    method: 'POST',
                    headers: {
                        'Cookie': cookies,
                    }
                })
            ).then(res => {
                const cookieHeader = res.headers.getSetCookie();
                cookies = cookieSetter(cookieHeader)
            });
            const user = await dbAccess.authDB.userAccess.getUser("admin");
            const session = await dbAccess.authDB.userAccess.sessionByUserID(user?.id ?? -1);

            const sessionID = cookies.split('; ')
                .find(row => row.startsWith("session_id="))?.split('=')[1] || "";

            expect(session).not.toBeDefined();
            expect(sessionID.length).toBe(0);
        });

        it(`should login and retrieve user`, async () => {
            const expected = testUser.username;
            let cookies = await loginTestUser(sut);

            const {result: actual} = await sut.handle(
                new Request(`${domain}${Routes.profile.base}${Routes.profile.keys.me}`, {
                    method: 'GET',
                    headers: {
                        'Cookie': cookies,
                    }
                })
            ).then((res: Response) => {
                return res.json();
            });

            const {user} = actual;
            expect(user.username).toEqual(expected);
        });
    });

    describe('Profile updates', () => {
        let cookies = '';

        beforeEach(async () => {
            cookies = await loginTestUser(sut);
        });

        it(`should update profile`, async () => {
            const expected = {
                display_name: "testname"
            };

            const userResult = await sut.handle(
                new Request(`${domain}${Routes.profile.base}${Routes.profile.keys.me}`, {
                    method: 'GET',
                    headers: {
                        'Cookie': cookies,
                    }
                })
            ).then((res: Response) => res.json());

            expect(userResult.result.user.display_name).toEqual('test1');

            const userUpdateResult = await sut.handle(
                new Request(`${domain}${Routes.profile.base}${Routes.profile.keys.me}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': cookies,
                    },
                    body: JSON.stringify({
                        display_name: "testname",
                    }),
                })
            ).then((res: Response) => res.json());

            expect(userUpdateResult.result.success).toBeTrue();

            const updatedUserResult = await sut.handle(
                new Request(`${domain}${Routes.profile.base}${Routes.profile.keys.me}`, {
                    method: 'GET',
                    headers: {
                        'Cookie': cookies,
                    }
                })
            ).then((res: Response) => res.json());

            expect(updatedUserResult.result.user.display_name).toEqual(expected.display_name);
        });
    });
});