<script>
    import Header from "./lib/Header.svelte";
    import SideNav from "./lib/SideNav.svelte";
</script>

<div class="flex flex-col">
    <Header/>

    <div class="flex flex-row">
        <SideNav/>
        <div class="pl-48">
            <slot></slot>
        </div>
    </div>

</div>