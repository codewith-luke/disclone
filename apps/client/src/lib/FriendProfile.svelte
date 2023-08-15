<script>
    import UserProfileAction from "./UserProfileAction.svelte";
    import {MoreVertical} from "lucide-svelte";

    export let index;
</script>

<div class="flex justify-center gap-x-4 items-center text-surface-400">
    <UserProfileAction/>
    User#{index}
    <MoreVertical/>
</div>