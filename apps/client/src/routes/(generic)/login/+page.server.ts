import type {Actions} from "@sveltejs/kit";
import {AuthApi} from "disclone-sdk";
import {parseString} from "set-cookie-parser";
import {fail} from "@sveltejs/kit";

export const actions = /**/{
    default: async ({cookies, request, setHeaders}) => {
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
            const {user} = await apiResponse.value();

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