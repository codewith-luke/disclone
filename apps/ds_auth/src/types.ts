import {t, UnwrapSchema} from "elysia";
import {ProfileUpdateRequest} from "./user-handler";

export type User = UnwrapSchema<typeof User>
export type UserUpdateFields = UnwrapSchema<typeof ProfileUpdateRequest>

export type ErrorResponseMessage = UnwrapSchema<typeof ErrorResponseMessage>;

export type SetCookie = (name: string, value: string, options: any) => void;
export type RemoveCookie = (name: string) => void;
export type JWTSign = {
    sign: (payload: Record<string, string>) => Promise<string>;
}

export type JWTProfile = {
    id: string;
    username: string;
    session_id: string;
}

const Permissions = {
    read: "read",
    write: "write",
    delete: "delete",
    update: "update",
} as const;

export const Cookies = {
    sessionID: 'session_id',
    sessionToken: 'session_token'
}

export const State = {
    userAccess: 'userAccess'
} as const;

export const Routes = {
    heartbeat: '/heartbeat',
    auth: {
        base: '',
        keys: {
            me: '/me',
            login: '/login',
            logout: '/logout',
            register: '/register',
        }
    },
    profile: {
        base: '/profile',
        keys: {
            archive: '/archive',
            me: '/',
        }
    }
} as const;

export const Environments = {
    development: 'development',
    production: 'production',
}

export const User = t.Object({
    id: t.Number(),
    username: t.String(),
    display_name: t.String(),
    email: t.String(),
    permissions: t.Union([
        t.Literal(Permissions.read),
        t.Literal(Permissions.write),
        t.Literal(Permissions.delete),
        t.Literal(Permissions.update),
    ]),
    password: t.String(),
    archived: t.Boolean(),
    created_at: t.Date(),
    updated_at: t.Date(),
});

User.sanatize = (user: User) => {
    const {password, permissions, ...rest} = user;
    return rest;
};

export const ErrorResponseMessage = t.Object({
    status: t.Number(),
    message: t.String()
});
