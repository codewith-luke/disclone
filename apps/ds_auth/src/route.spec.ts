import {beforeAll, describe, expect, it} from 'bun:test'
import {Elysia} from "elysia";
import {createApp} from "./index";
import {Environments, Routes} from "./types";

const domain = "http://localhost";

describe("ds_auth", () => {
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

    it(`[${Routes.login}] return a user in response`, async () => {
        const expected = {
            username: "test",
            token: "123456",
        };
        const sut = createApp();

        const actual = await sut.handle(
            new Request(`${domain}${Routes.login}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: "test",
                    password: "securepassword",
                }),
            })
        ).then(res => res.json());

        expect(actual.username).toBe(expected.username);
        expect(actual.token).toBeDefined();
    });
})