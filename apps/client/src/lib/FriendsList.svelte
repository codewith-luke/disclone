<div class="flex flex-col gap-y-4 mt-4">
    {#each Array(users) as _, idx}
        <FriendProfileAction index={idx}/>
    {/each}
</div>

<script lang="ts">
    import FriendProfileAction from "./FriendProfile.svelte";
    import {ListBox, ListBoxItem} from "@skeletonlabs/skeleton";
    import {PlusCircle, MinusCircle} from "lucide-svelte";

    let users = 20;
</script>
