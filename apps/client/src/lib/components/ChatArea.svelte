<svelte:window on:keydown={handleKeydown}/>
<div class="h-full flex flex-col">
    <div class="overflow-hidden">
        <section class="overflow-y-scroll h-full space-y-4 p-4">
            <Message/>
            {#each messageFeed as bubble, i}
                <Message/>
                <!--{#if bubble.host === true}-->
                <!--    &lt;!&ndash; Host Message Bubble &ndash;&gt;-->
                <!--    <pre>host: {JSON.stringify(bubble, null, 2)}</pre>-->
                <!--{:else}-->
                <!--    &lt;!&ndash; Guest Message Bubble &ndash;&gt;-->
                <!--    <pre>guest: {JSON.stringify(bubble, null, 2)}</pre>-->
                <!--{/if}-->
            {/each}
        </section>
    </div>


    <div class="flex justify-center items-center mb-6 mx-8 gap-x-4 text-surface-300">
        <FileUploadInput/>

        <label class="flex flex-1 label">
            <input class="input p-2" type="text" placeholder="Input" bind:this={messageInputEl}/>
        </label>

        <EmoteActions/>
    </div>
</div>

<script lang="ts">
    import FileUploadInput from "./FileUploadInput.svelte";
    import EmoteActions from "./EmoteActions.svelte";
    import Message from "./Message.svelte";
    import {Key} from "w3c-keys";

    let messageInputEl: HTMLInputElement;
    let messageFeed = new Array(10).fill({});

    function handleKeydown(event) {
        if (event.key === Key.Space) {
            messageInputEl.focus();
        }
    }
</script>