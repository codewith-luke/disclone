<script lang="ts">
    import {enhance} from '$app/forms'
    import type {ActionData} from './$types';
    import {getUserStore} from "$lib/store";
    import {goto} from "$app/navigation";

    export let form: ActionData;

    const user = getUserStore();

    $: {
        if (form?.success) {
            user.set(form.user);
        }

        if ($user?.id) {
            goto('/');
        }
    }
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








