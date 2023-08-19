<div class="flex justify-center group gap-x-4 items-center text-surface-400 cursor-pointer">
    <UserProfileAction/>
    <span class="text-group-hover">
    User#{index}
    </span>

    <button use:popup={popupCombobox}>
        <MoreVertical class="opacity-0 group-hover:opacity-100"/>
    </button>

    <div class="card w-48 shadow-xl py-2 fixed z-10 text-surface-400" data-popup={`popupComboBox-${index}`}>
        <ListBox class="relative z-10" rounded="rounded-none">
            <ListBoxItem bind:group={comboboxValue} name="medium" value="remove">
                <div class="flex items-center gap-x-2">
                    <MinusCircle/>
                    <span>
                        Remove Friend
                    </span>
                </div>
            </ListBoxItem>
            <ListBoxItem bind:group={comboboxValue} name="medium" value="add_to_chat">
                <div class="flex items-center gap-x-2">
                    <PlusCircle/>
                    <span>
                        Add to chat
                    </span>
                </div>
            </ListBoxItem>
        </ListBox>
        <div class="arrow bg-surface-100-800-token"/>
    </div>
</div>

<script lang="ts">
    import UserProfileAction from "./UserProfileAction.svelte";
    import {MinusCircle, MoreVertical, PlusCircle} from "lucide-svelte";
    import {type PopupSettings, popup, ListBoxItem, ListBox} from "@skeletonlabs/skeleton";

    export let index;

    const popupCombobox: PopupSettings = {
        event: 'focus-click',
        target: `popupComboBox-${index}`,
        placement: 'right-start',
        closeQuery: '.listbox-item'
    };

    let comboboxValue: string;
</script>
