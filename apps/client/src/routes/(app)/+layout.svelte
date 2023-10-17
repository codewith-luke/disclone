<script>
    import {Modal} from "@skeletonlabs/skeleton";
    import Header from "$lib/Header.svelte";
    import SideNav from "$lib/SideNav.svelte";
    import {beforeNavigate} from "$app/navigation";
    import {getUserStore} from "$lib/stores/store";

    const user = getUserStore();

    $: beforeNavigate((navigation) => {
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
