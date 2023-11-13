<script lang="ts">
    import {tick} from 'svelte';
    import {Key} from "w3c-keys";

    import FileUploadInput from "./FileUploadInput.svelte";
    import TipTap from "./TipTap.svelte";
    import EmoteActions from "./EmoteActions.svelte";
    import Message from "./Message.svelte";
    import {getUserStore} from "$lib/store";

    const user = getUserStore();

    let emoteAdded: (name: string) => void;
    let messageInputEl: HTMLInputElement;
    let chatArea: HTMLElement;
    let users = new Map();
    let messageFeed = [{
        userId: 1,
        profileImage: 'https://randomuser.me/api/portraits/men/76.jpg',
        message: `Hello World! \n\n this is a new line <script>alert('hello')</\script> :peepoDJ:`,
        timestamp: Date.now(),
    }];

    user.subscribe((updatedUser) => {
        users.set(updatedUser.id, updatedUser);
        users = users;
    });

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === Key.Space) {
            messageInputEl.focus();
        }
    }

    async function handleMessageSend(event: CustomEvent<string>) {
        if (!event.detail) {
            console.error("Missing message detail");
            return;
        }

        const message = event.detail;

        messageFeed.push({
            userId: $user.id,
            profileImage: 'https://randomuser.me/api/portraits/men/76.jpg',
            message,
            timestamp: Date.now(),
        });

        messageFeed = messageFeed;

        await tick();

        chatArea.scrollTo({top: chatArea.scrollHeight, behavior: "smooth"});
    }

    function handleEmoteClick(ev: CustomEvent) {
        if (!ev.detail) {
            console.error("Missing message input or emote detail");
            return;
        }

        const {name} = ev.detail;
        emoteAdded(name);
    }
</script>

<svelte:window on:keydown={handleKeydown}/>
<div class="h-full flex flex-col">

    <div class="overflow-hidden flex-grow">
        <section bind:this={chatArea} class="overflow-y-auto h-full space-y-4 p-4">
            {#if messageFeed.length > 0 && $user?.id}
                {#each messageFeed as message}
                    <Message message="{message}" userId="{$user.id}"
                             displayName={users.get(message.userId)?.displayName || "Default"}/>
                {/each}
            {/if}
        </section>
    </div>

    <div class="flex justify-between items-center my-6 mx-8 gap-x-4 text-surface-300">
        <FileUploadInput/>

        <TipTap on:send={handleMessageSend} bind:emoteAdded={emoteAdded}/>

        <EmoteActions on:change={handleEmoteClick}/>
    </div>
</div>
