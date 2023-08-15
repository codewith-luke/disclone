<div class="flex flex-col h-full gap-y-6">
    <div class="h-full overflow-y-scroll">
        <section class="w-full p-4 overflow-y-auto space-y-4">
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
            <input class="input p-2" type="text" placeholder="Input"/>
        </label>

        <EmoteActions/>
    </div>
</div>

<script>
    import FileUploadInput from "./FileUploadInput.svelte";
    import EmoteActions from "./EmoteActions.svelte";
    import Message from "./Message.svelte";

    let messageFeed = new Array(6).fill({

    })
</script>