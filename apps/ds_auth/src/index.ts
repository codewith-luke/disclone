import {Elysia} from "elysia";
import {userHandler} from "./user_handler";

const app = new Elysia()
    .get("/heartbeat", () => "ok")
    .use(userHandler)
    .listen(Bun.env.PORT);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
