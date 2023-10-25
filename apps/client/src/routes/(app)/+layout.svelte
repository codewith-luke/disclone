<script lang="ts">
    import {ProfileApi} from "disclone-sdk";
    import {Modal} from "@skeletonlabs/skeleton";
    import {onMount} from "svelte";
    import Header from "$lib/Header.svelte";
    import SideNav from "$lib/SideNav.svelte";
    import {getUserStore} from "$lib/stores/store";

    const user = getUserStore();

    onMount(() => {
        const profileApi = new ProfileApi();

        if ($user.id) {
            return () => {
            };
        }

        profileApi.getProfile({
            credentials: "include"
        }).then((res) => {
            const {result, error} = res;

            if (error) {
                console.error(error);
                return;
            }

            if (!result) {
                console.error("No user found");
                return;
            }

            user.set(result.user);
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
