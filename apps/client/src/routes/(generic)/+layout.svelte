<script>
import {Modal} from "@skeletonlabs/skeleton";
import Header from "$lib/Header.svelte";
import SideNav from "$lib/SideNav.svelte";
</script>

<div class="h-screen flex flex-col">
    <slot/>
</div>

<Modal/>

<style>
    html,
    body {
        min-height: 100%;
    }
</style>
