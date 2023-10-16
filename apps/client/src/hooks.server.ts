import type {Handle} from '@sveltejs/kit';
import {redirect} from "@sveltejs/kit";

export async function handle({event, resolve}): Promise<Handle> {
    const sessionID = event.cookies.get('session_id');
    const sessionToken = event.cookies.get('session_token');

    if (sessionID && sessionToken) {
        event.locals.hasAuth = true;
        event.locals.sessionToken = sessionToken;
    }

    if (event.url.pathname === "/" && !event.locals.hasAuth) {
        throw redirect(303, "/login");
    }

    return await resolve(event);
}
