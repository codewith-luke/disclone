<div class="flex justify-center group gap-x-4 items-center text-surface-400 cursor-pointer">
    <UserProfileAction/>
    <span class="text-group-hover">
    User#{index}
    </span>

    <button use:popup={popupCombobox}>
        <MoreVertical class="opacity-0 group-hover:opacity-100"/>
    </button>
</div>

<script lang="ts">
    import UserProfileAction from "./UserProfileAction.svelte";
    import {MoreVertical} from "lucide-svelte";
    import {type PopupSettings, popup} from "@skeletonlabs/skeleton";

    export let index;

    const popupCombobox: PopupSettings = {
        event: 'focus-click',
        target: 'popupCombobox',
        placement: 'right-start',
        closeQuery: '.listbox-item'
    };

    let comboboxValue: string;
</script>
