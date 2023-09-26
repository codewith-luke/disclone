import {createApp} from "./server";

createApp()
    .listen(Bun.env.PORT)

console.log(`Server listening on port ${Bun.env.PORT}`);
