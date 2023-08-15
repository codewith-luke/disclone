<script>
    import Header from "./lib/Header.svelte";
    import SideNav from "./lib/SideNav.svelte";
</script>

<div class="flex flex-col h-full">
    <Header/>

    <div class="relative flex flex-row h-full overflow-hidden">
        <SideNav/>
        <div class="pl-48 w-full">
            <slot></slot>
        </div>
    </div>
</div>