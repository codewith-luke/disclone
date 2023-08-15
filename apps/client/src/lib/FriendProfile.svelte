<script>
    import UserProfileAction from "./UserProfileAction.svelte";
    import {MoreVertical} from "lucide-svelte";

    export let index;
</script>

<div class="flex justify-center group gap-x-4 items-center text-surface-400 cursor-pointer">
    <UserProfileAction/>
    <span class="text-group-hover">
    User#{index}
    </span>
    <MoreVertical class="opacity-0 group-hover:opacity-100"/>
</div>