<script lang="ts">
    import Header from "../lib/Header.svelte";
    import SideNav from "../lib/SideNav.svelte";
</script>

<div class="flex flex-col h-full">
    <Header/>

    <div class="relative flex flex-row h-full overflow-hidden">
        <SideNav/>
        <slot></slot>
    </div>
</div>