import {Elysia} from "elysia";
import {userHandler} from "./user-handler";
import {setup} from "./setup";
import {createHttpErrorResponse, HttpErrorMessages} from "./error";

const app = new Elysia()
    .use(setup)
    .get("/heartbeat", () => "ok")
    .use(userHandler)
    .onError(({code, error}) => {
        return createHttpErrorResponse(HttpErrorMessages.unknownError, error);
    })
    .listen(Bun.env.PORT);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
