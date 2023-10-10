import type {Handle} from '@sveltejs/kit';

export async function handle({event, resolve}): Promise<Handle> {
    const sessionID = event.cookies.get('session_id');
    const sessionToken = event.cookies.get('session_token');

    if (sessionID && sessionToken) {
        event.locals.user = {
        }
    }

    return await resolve(event);
}