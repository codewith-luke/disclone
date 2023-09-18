export {};

declare module "bun" {
    export interface Env {
        PORT: number;
        SECRET: string;
    }
}