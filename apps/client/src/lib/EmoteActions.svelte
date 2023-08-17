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
        <div>
            Emotes
        </div>
        <div class="arrow bg-surface-100-800-token"/>
    </div>
</div>

<script lang="ts">
    import {Sticker, Meh} from "lucide-svelte";
    import {type PopupSettings, popup} from "@skeletonlabs/skeleton";

    const popupGifOptions: PopupSettings = {
        target: 'popupGifSettings',
        event: 'click',
        placement: 'top-end',
    };

    const popupEmoteOptions: PopupSettings = {
        target: 'popupEmoteSettings',
        event: 'click',
        placement: 'top-end',
    };
</script>