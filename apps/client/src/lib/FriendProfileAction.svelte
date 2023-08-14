<script>
    import UserProfileAction from "./UserProfileAction.svelte";

    export let index;
</script>

<div class="flex pl-10 gap-x-4 items-center">
    <UserProfileAction/>
    User#{index}
</div>