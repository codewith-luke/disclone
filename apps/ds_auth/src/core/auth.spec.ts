import {describe, expect, it, test} from "bun:test";
import {createSignatureToken, hashPassword, passwordMatches, validatePassword, validateUsername} from "./auth";
import {User} from "../types";

describe("auth", () => {
    describe('createSignatureToken', function () {
        it(`create a token and should miss-match given wrong username`, async () => {
            const expected = "ok";
            const timestamp = new Date();
            const tokenA = createSignatureToken('session_id', 'secret', {
                username: "test",
            } as User);

            const tokenB = createSignatureToken('session_id', 'secret', {
                username: "tes",
            } as User);

            expect(tokenA).not.toBe(tokenB);
        });

        it(`create a token and should miss-match given wrong secret`, async () => {
            const expected = "ok";
            const timestamp = new Date();
            const tokenA = createSignatureToken('session_id', 'secret', {
                username: "test",
            } as User);

            const tokenB = createSignatureToken('session_id', 'secre', {
                username: "test",
            } as User);

            expect(tokenA).not.toBe(tokenB);
        });

        it(`create a token and should miss-match given wrong session`, async () => {
            const expected = "ok";
            const timestamp = new Date();
            const tokenA = createSignatureToken('session_id', 'secret', {
                username: "test",
            } as User);

            const tokenB = createSignatureToken('session', 'secret', {
                username: "test",
            } as User);

            expect(tokenA).not.toBe(tokenB);
        });
    });

    describe('validatePassword', function () {
        const expectedBasicPassword = 'Password must contain at least one uppercase letter, lowercase letter, number and special character';

        it('should fail with spaces or slashes', function () {
            const expected = 'Password must not contain spaces or slashes';
            const tests = [{
                input: '12345678! ',
            }, {
                input: '12345678/',
            }, {
                input: '12345678\\',
            }];

            for (const test of tests) {
                const actual = validatePassword(test.input);
                expect(actual?.message).toBe(expected);
            }
        });

        it('should fail with short password', function () {
            const actual = validatePassword('1234567');
            expect(actual?.message).toBe(expectedBasicPassword);
        });

        it('should fail with invalid formatted password', function () {
            const tests = [{
                input: '12345678',
            }, {
                input: '12345678A',
            }, {
                input: 'sdasd!Aa',
            }, {
                input: '1dasdAa',
            }];

            for (const test of tests) {
                const actual = validatePassword(test.input);
                expect(actual?.message).toBe(expectedBasicPassword);
            }
        });

        it('should fail with repeating characters 3 or more', function () {
            const expected = 'Password must not contain repeating characters more than 3 times';
            const tests = [{
                input: '1aaaaaaA!',
            }, {
                input: '111aAcvsdf!',
            }, {
                input: '11aAcv!!!sdf!',
            }];

            for (const test of tests) {
                const actual = validatePassword(test.input);
                expect(actual?.message).toBe(expected);
            }
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

            expect(async () => {
                await passwordMatches('admin', hashPass, 'pepper');
            }).toThrow();
        });

        it('should fail with no pepper given', async function () {
            const hashPass = await hashPassword('admin', 'pepper');

            expect(async () => {
                await passwordMatches('admin', hashPass, '');
            }).toThrow();
        });

        it('should fail with invalid pepper', async function () {
            const hashPass = await hashPassword('admin', 'pepper');
            const actual = await passwordMatches('admin', hashPass, 'pepe');
            expect(actual).toBeFalse();
        });

        it('should fail with invalid password', function () {
            expect(async () => {
                await hashPassword("", "pepper");
            }).toThrow('Password is missing');
        });

        it('should fail with invalid pepper', function () {
            expect(async () => {
                await hashPassword("123462", "");
            }).toThrow('Password pepper is missing');
        });
    });

    describe('validateUsername', function () {
        it('should not contain any slashes or spaces', function () {
            const expected = 'Username must not contain any special characters';
            const tests = [{
                input: 'username!',
            }, {
                input: 'username/',
            }, {
                input: 'username\\',
            }];

            for (const test of tests) {
                const actual = validateUsername(test.input);
                expect(actual?.message).toBe(expected);
            }
        });

        it('should not contain any spaces', function () {
            const expected = "Username must not contain spaces"
            const actual = validateUsername('username ');
            expect(actual?.message).toBe(expected);
        });
    });
});
