<script lang="ts">
    import {AuthApi} from "disclone-sdk";

    const authApi = new AuthApi();

    authApi.login({
        loginRequest: {
            username: "admin",
            password: "admin"
        }
    }, {
       credentials: "include"
    }).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
</script>

<svelte:head>
    <title>Login</title>
    <meta name="description" content="Disclone"/>
</svelte:head>

<h1>Login Page</h1>






