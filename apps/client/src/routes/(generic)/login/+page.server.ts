import type {Actions} from "@sveltejs/kit";
import type {PageLoad} from './$types';
import {AuthApi} from "disclone-sdk";
import {parseString} from "set-cookie-parser";
import {fail, redirect} from "@sveltejs/kit";

export const actions = /**/{
    default: async ({cookies, request}) => {
        try {
            const data = await request.formData();
            const username = data.get('username') as string;
            const password = data.get('password') as string;

            const authAPI = new AuthApi();
            const apiResponse = await authAPI.loginRaw({
                loginRequest: {
                    username,
                    password
                }
            }, {
                credentials: 'include'
            });

            const loginResponse = apiResponse.raw;
            const {result, error} = await apiResponse.value();

            if (error) {
                console.log(error.message);
                return fail(error.status, {message: error.message});
            }

            const user = result?.user;

            if (!user) {
                console.log('No user found');
                return fail(401, {message: 'Invalid user credentials'})
            }

            const loginCookies = loginResponse.headers.getSetCookie();

            for (const c of loginCookies) {
                const {name, value, ...options} = parseString(c);
                cookies.set(name, value, {
                    ...options,
                    sameSite: 'lax'
                });
            }

            return {
                success: true,
                user
            }
        } catch (e) {
            console.error(e);
            return fail(401, {message: 'Invalid user credentials'})
        }
    },
} satisfies Actions;