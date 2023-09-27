import {afterAll, beforeAll, describe, expect, it} from 'bun:test'
import {Elysia} from "elysia";
import {Environments, Routes} from "./types";
import {createApp} from "./server";
import {HttpErrorMessages} from "./util/error";

const domain = "http://localhost";

describe("dsa", () => {
    let sut = createApp()

    beforeAll(() => {
        Bun.env.NODE_ENV = Environments.development;
        Bun.env.PASSWORD_PEPPER = "pepper";
        sut.listen(Bun.env.PORT);
    });

    afterAll(function () {
        sut.stop();
    });

    it(`[${Routes.heartbeat}] return an ok in response`, async () => {
        const expected = "ok";

        const actual = await sut.handle(
            new Request(`${domain}${Routes.heartbeat}`)
        ).then(res => res.text());

        expect(actual).toBe(expected);
    });

    describe(`[${Routes.register}]`, function () {
        it(`[${Routes.register}] should return 400 if invalid email`, async () => {
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
    });

    describe(`${Routes.login}`, function () {
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
        });
    });


    it(`[${Routes.logout} removes cookie and logs out user`, async function () {
        const expected = {
            username: "test",
            token: "123456",
        };

        let cookies = "";

        // TODO - Login and set cookie in the DB
        //        Validate it is gone

        const actual = await sut.handle(
            new Request(`${domain}${Routes.logout}`, {
                method: 'POST',
                headers: {
                    'Cookie': "session_id=thisisthecookie",
                }
            })
        ).then(res => {
            cookies = res.headers.get("Set-Cookie") ?? "";
        });

        const sessionID = cookies.split('; ')
            .find(row => row.startsWith("session_id="))?.split('=')[1] || "";

        expect(sessionID.length).toBe(0);
    });
});