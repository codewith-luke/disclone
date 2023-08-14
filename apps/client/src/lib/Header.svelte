<script>
    import HeaderActions from "./HeaderActions.svelte";
    import UserProfileAction from "./UserProfileAction.svelte";
</script>

<header class="flex justify-between h-20 bg-surface-900 drop-shadow-lg z-10 px-10">
    <div class="flex justify-center items-center">
        <UserProfileAction/>
    </div>
    <div class="flex justify-center items-center">
        <HeaderActions/>
    </div>
</header>