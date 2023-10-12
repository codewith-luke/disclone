<script lang="ts">
    import {enhance} from '$app/forms'
    import type {ActionData} from './$types';

    export let form: ActionData;
</script>

<svelte:head>
    <title>Login</title>
    <meta name="description" content="Disclone"/>
</svelte:head>

{#if !form?.success}
    <form method="post" class="flex flex-col justify-center gap-y-6 text-black" use:enhance>
        <input type="text" name="username" class="rounded-xl" placeholder="Username" value="admin"/>
        <input type="password" name="password" class="rounded-xl" placeholder="Password" value="admin"/>
        <button class="btn variant-filled-primary">Submit</button>
    </form>
{/if}

<div>
    {#if form?.success}
        <p>Successfully logged in! Welcome back, {JSON.stringify(form?.user.username)}</p>
    {/if}
</div>





