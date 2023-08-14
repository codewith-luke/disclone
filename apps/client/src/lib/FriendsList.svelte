<script>
    import FriendProfileAction from "./FriendProfileAction.svelte";

    let users = 5;
</script>

<div class="flex flex-col gap-y-4 mt-4">
    {#each Array(users) as _, idx}
        <FriendProfileAction index={idx}/>
    {/each}
</div>