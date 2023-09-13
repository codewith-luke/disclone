type SensitiveKeys = {
    password: string;
    email: string;
}

type Permission = "read" | "write" | "delete" | "update";

export type User = {
    id: number;
    username: string;
    permissions: Permission[];
}

export type UserWithAuth = User & {
    [K in keyof SensitiveKeys]: SensitiveKeys[K];
}

export type ErrorResponseMessage = {
    status: number;
    message: string;
}


