type SensitiveKeys = {
    password: string;
    email: string;
}

type Permission = "read" | "write" | "delete" | "update";

export type User = {
    id: number;
    username: string;
    password: string;
    permissions: Permission[];
}

export type UserWithAuth = User & {
    [K in keyof SensitiveKeys]: SensitiveKeys[K];
}

export type ErrorResponseMessage = {
    status: number;
    message: string;
}

export const Cookies = {
    sessionID: 'session_id'
}

export const State = {
    userAccess: 'userAccess'
} as const;

export const Routes = {
    heartbeat: '/heartbeat',
    login: '/login',
    logout: '/logout',
    register: '/register',
} as const;

export const Environments = {
    development: 'development',
    production: 'production',
}

