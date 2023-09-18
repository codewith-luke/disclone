import {describe, expect, it} from "bun:test";
import {createSignatureToken, hashPassword, passwordMatches} from "./auth";
import {User} from "../types";

describe("auth", () => {
    describe('createSignatureToken', function () {
        it(`create a token and should miss-match given wrong username`, async () => {
            const expected = "ok";
            const timestamp = new Date();
            const tokenA = createSignatureToken('secret', {
                username: "test",
            } as User);

            const tokenB = createSignatureToken('secret', {
                username: "tes",
            } as User);

            expect(tokenA).not.toBe(tokenB);
        });

        it(`create a token and should miss-match given wrong secret`, async () => {
            const expected = "ok";
            const timestamp = new Date();
            const tokenA = createSignatureToken('secret', {
                username: "test",
            } as User);

            const tokenB = createSignatureToken('secre', {
                username: "test",
            } as User);

            expect(tokenA).not.toBe(tokenB);
        });
    });

    describe('hashPassword', function () {
        it('should return hashed password based on callback which should match', async function () {
            const hashPass = await hashPassword('test');
            const actual = await passwordMatches('test', hashPass);
            expect(actual).toBe(true);
        });
    });
});
