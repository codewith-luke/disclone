<script lang="ts">
    import './styles.css';
    import {initializeStores, storePopup} from '@skeletonlabs/skeleton';
    import {arrow, autoUpdate, computePosition, flip, offset, shift} from '@floating-ui/dom';
    import {getEmoteStore, initStores} from "$lib/store";
    import {setContext} from "svelte";
    import {fetchEmotes} from "$lib/emote-parser";

    storePopup.set({computePosition, autoUpdate, offset, shift, flip, arrow});
    initializeStores();
    initStores();

    const emoteStore = getEmoteStore();

    async function init() {
        const emotes = await fetchEmotes();
        emoteStore.set(emotes);
    }
</script>

<div class="h-screen flex flex-col">
    {#await init()}
        Loading...
    {:then _}
        <slot/>
    {:catch someError}
        System error: {someError.message}.
    {/await}
</div>

