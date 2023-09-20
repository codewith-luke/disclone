import {beforeAll, describe, expect, it} from 'bun:test'
import {Elysia} from "elysia";
import {createApp} from "./index";
import {Environments, Routes} from "./types";

const domain = "http://localhost";

describe("dsa", () => {
    beforeAll(() => {
        Bun.env.NODE_ENV = Environments.development;
    });

    it(`[${Routes.heartbeat}] return an ok in response`, async () => {
        const expected = "ok";
        const sut = createApp();

        const actual = await sut.handle(
            new Request(`${domain}${Routes.heartbeat}`)
        ).then(res => res.text());

        expect(actual).toBe(expected);
    });

    describe(`[${Routes.register}]`, function () {
        it(`[${Routes.register}] should return 500 if invalid email`, async () => {
            const expected = {
                status: 401,
            }
            const sut = createApp();

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

    // it(`[${Routes.login}] return a user in response`, async () => {
    //     const expected = {
    //         username: "test",
    //         token: "123456",
    //     };
    //     const sut = createApp();
    //
    //     const actual = await sut.handle(
    //         new Request(`${domain}${Routes.login}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 username: "test",
    //                 password: "securepassword",
    //             }),
    //         })
    //     ).then(res => res.json());
    //
    //     expect(actual.username).toBe(expected.username);
    //     expect(actual.token).toBeDefined();
    // });

    it(`[${Routes.logout} removes cookie and logs out user`, async function () {
        const expected = {
            username: "test",
            token: "123456",
        };
        const sut = createApp();

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
            return res.json()
        });

        expect(actual.username).toBe(expected.username);
        expect(actual.token).toBeDefined();
    });
});