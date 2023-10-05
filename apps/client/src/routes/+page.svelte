<svelte:head>
    <title>Home</title>
    <meta name="description" content="Disclone"/>
</svelte:head>

<ChatArea/>

<script lang="ts">
    import {AuthApi} from "disclone-sdk";
    import ChatArea from "../lib/ChatArea.svelte";

    (async function () {
        const authApi = new AuthApi();

        const response = await authApi.login({
            loginRequest: {
                username: "admin",
                password: "admin"
            }
        }, {
            credentials: "include"
        });

        console.log(response);

        setTimeout(() => {
            authApi.logout({
                credentials: "include"
            }).then(() => {
                console.log("Logged out");
            });
        }, 5000);
    }());

</script>

