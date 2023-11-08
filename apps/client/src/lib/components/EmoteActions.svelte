<script lang="ts">
    import {Sticker, Meh} from "lucide-svelte";
    import {type PopupSettings, popup} from "@skeletonlabs/skeleton";
    import {getEmoteStore} from "$lib/store";
    import {createEventDispatcher} from "svelte";

    type EmoteButton = MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }

    const emotes = getEmoteStore();
    const dispatch = createEventDispatcher();

    const popupGifOptions: PopupSettings = {
        target: 'popupGifSettings',
        event: 'click',
        placement: 'top-end',
    };

    const popupEmoteOptions: PopupSettings = {
        target: 'popupEmoteSettings',
        event: 'click',
        placement: 'top-end',
        closeQuery: null
    };

    function changeState(e: EmoteButton) {
        const target = e.currentTarget as HTMLButtonElement;
        dispatch('change', target.dataset);
    }
</script>

<div class="flex justify-around gap-x-2">
    <button use:popup={popupGifOptions}>
        <Sticker class="text-hover"/>
    </button>

    <button use:popup={popupEmoteOptions}>
        <Meh class="text-hover"/>
    </button>

    <div class="card p-4 w-72 h-96 shadow-xl" data-popup="popupGifSettings">
        <div>
            Gifs
        </div>
        <div class="arrow bg-surface-100-800-token"/>
    </div>

    <div class="card p-4 w-72 h-96 shadow-xl" data-popup="popupEmoteSettings">
        <div class="space-y-1 space-x-2">
            {#each Object.keys($emotes) as key ($emotes[key].id)}
                <button class="w-8 h-8" on:click={changeState} type="button" data-emote-id="{$emotes[key].id}"
                        data-name="{$emotes[key].name}">
                    <img src="{$emotes[key].files.small.url}" alt="{$emotes[key].name}">
                </button>
            {/each}
        </div>
        <div class="arrow bg-surface-100-800-token"/>
    </div>
</div>
