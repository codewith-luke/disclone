<script>
import {Modal} from "@skeletonlabs/skeleton";
import Header from "$lib/Header.svelte";
import SideNav from "$lib/SideNav.svelte";
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
