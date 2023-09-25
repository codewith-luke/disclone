import {describe, expect, it} from "bun:test";
import {createSignatureToken, hashPassword, passwordMatches, validatePassword} from "./auth";
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

    describe('validatePassword', function () {
        it('should fail with spaces or slashes', function () {
            expect(() => {
                validatePassword(' ');
            }).toThrow('Password must not contain spaces or slashes');

            expect(() => {
                validatePassword('/');
            }).toThrow('Password must not contain spaces or slashes');

            expect(() => {
                validatePassword('\\');
            }).toThrow('Password must not contain spaces or slashes');
        });

        it('should fail with short password', function () {
            expect(() => {
                validatePassword('1234567');
            }).toThrow('Password must be between 8 and 64 characters long');
        });

        it('should fail with long password', function () {
            expect(() => {
                validatePassword('12345678901234567890123456789012345678901234567890123456789012345678901234567890');
            }).toThrow('Password must be between 8 and 64 characters long');
        });

        it('should fail with missing special character', function () {
            expect(() => {
                validatePassword('12345678');
            }).toThrow('Password must contain at least one special character');
        });

        it('should fail with no uppercase character', function () {
            expect(() => {
                validatePassword('1234567!');
            }).toThrow('Password must contain at least one uppercase letter');
        });

        it('should fail with no lowercase character', function () {
            expect(() => {
                validatePassword('1234567A!');
            }).toThrow('Password must contain at least one lowercase letter');
        });

        it('should fail with no number character', function () {
            expect(() => {
                validatePassword('aaaaaaA!');
            }).toThrow('Password must contain at least one number');
        });

        it('should fail with repeating characters 3 or more', function () {
            expect(() => {
                validatePassword('1aaaaaaA!');
            }).toThrow('Password must not contain repeating characters more than 3 times');

            expect(() => {
                validatePassword('111aAcvsdf!');
            }).toThrow('Password must not contain repeating characters more than 3 times');

            expect(() => {
                validatePassword('11aAcv!!!sdf!');
            }).toThrow('Password must not contain repeating characters more than 3 times');
        });
    });

    describe('hashPassword', function () {
        it('should return hashed password based on callback which should match', async function () {
            const hashPass = await hashPassword('admin', 'pepper');
            const actual = await passwordMatches('admin', hashPass, 'pepper');
            expect(actual).toBeTrue();
        });

        it('should fail with invalid password', async function () {
            const hashPass = await hashPassword('admin', 'pepper');
            const actual = await passwordMatches('admi', hashPass, 'pepper');
            expect(actual).toBeFalse();
        });

        it('should fail with invalid hash', async function () {
            let hashPass = await hashPassword('admin', 'pepper');
            hashPass = `a${hashPass}`;
            const actual = await passwordMatches('admin', hashPass, 'pepper');
            expect(actual).toBeFalse();
        });

        it('should fail with invalid pepper', async function () {
            const hashPass = await hashPassword('admin', 'pepper');
            const actual = await passwordMatches('admin', hashPass, 'pepe');
            expect(actual).toBeFalse();
        });
    });
});
