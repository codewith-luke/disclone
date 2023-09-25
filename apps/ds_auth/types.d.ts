export {};

declare module "bun" {
    export interface Env {
        PORT: number;
        PASSWORD_PEPPER: string;
        SECRET: string;
    }
}