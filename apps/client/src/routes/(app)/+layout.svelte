<script lang="ts">
    import {AuthApi} from "disclone-sdk";
    import {Modal} from "@skeletonlabs/skeleton";
    import {onMount} from "svelte";
    import Header from "$lib/Header.svelte";
    import SideNav from "$lib/SideNav.svelte";
    import {getUserStore} from "$lib/stores/store";

    const user = getUserStore();

    onMount(() => {
        const authAPI = new AuthApi();

        if ($user.id) {
            return () => {
            };
        }

        authAPI.me({
            credentials: "include"
        }).then((res) => {
            user.set(res.user);
        });

        return () => {
        }
    });
</script>

<div class="h-screen flex flex-col">
    <Header/>

    <div class="flex flex-1 overflow-hidden">
        <SideNav/>
        <div class="w-full">
            <slot/>
        </div>
    </div>
</div>

<Modal/>
