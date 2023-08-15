<script>
    import FriendProfileAction from "./FriendProfile.svelte";

    let users = 20;
</script>

<div class="flex flex-col gap-y-4 mt-4">
    {#each Array(users) as _, idx}
        <FriendProfileAction index={idx}/>
    {/each}
</div>