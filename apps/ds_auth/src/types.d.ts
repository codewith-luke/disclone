export {};

declare module "bun" {
    export interface Env {
        HOST: string;
        PORT: number;
        PASSWORD_PEPPER: string;
        SECRET: string;

        POSTGRES_HOST: string;
        POSTGRES_PORT: number;
        POSTGRES_USER: string;
        POSTGRES_PASSWORD: string;
        POSTGRES_DB: string;
    }
}