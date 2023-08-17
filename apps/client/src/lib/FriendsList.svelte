<div class="flex flex-col gap-y-4 mt-4">
    <div class="card w-48 shadow-xl py-2 fixed z-10 text-surface-400" data-popup="popupCombobox">
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

    {#each Array(users) as _, idx}
        <FriendProfileAction index={idx}/>
    {/each}
</div>

<script lang="ts">
    import FriendProfileAction from "./FriendProfile.svelte";
    import {ListBox, ListBoxItem} from "@skeletonlabs/skeleton";
    import {PlusCircle, MinusCircle} from "lucide-svelte";

    let users = 20;

    let comboboxValue: string;
</script>
