import {t, UnwrapSchema} from "elysia";

export type User = UnwrapSchema<typeof User>

export type ErrorResponseMessage = UnwrapSchema<typeof ErrorResponseMessage>;

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
    login: '/login',
    logout: '/logout',
    archive: '/archive',
    register: '/register',
} as const;

export const Environments = {
    development: 'development',
    production: 'production',
}

export const User = t.Object({
    id: t.Number(),
    username: t.String(),
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

User.toJSON = (user: User) => {
    const {password, permissions, ...rest} = user;
    return rest;
};

export const ErrorResponseMessage = t.Object({
    status: t.Number(),
    body: t.Object({
        message: t.String()
    })
});
