<script lang="ts">
    import {tick} from 'svelte';
    import {Key} from "w3c-keys";

    import FileUploadInput from "./FileUploadInput.svelte";
    import EmoteActions from "./EmoteActions.svelte";
    import Message from "./Message.svelte";
    import {getUserStore} from "$lib/store";

    const user = getUserStore();

    let messageInputEl: HTMLInputElement;
    let formEl: HTMLFormElement;
    let chatArea: HTMLElement;
    let users = new Map();

    user.subscribe((updatedUser) => {
        users.set(updatedUser.id, updatedUser);
        users = users;
    });

    let messageFeed = (function getMessages() {
        users.set(21, {id: 21, displayName: "John Doe"})

        let messages = new Array(5).fill({
            userId: 21,
            message: "Lorem ipsum dolor sit amet, consectetur adis",
            timestamp: Date.now(),
            profileImage: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
        });

        messages.push({
            userId: 1,
            message: "Lorem ipsum dolor sit amet, consectetur adis",
            timestamp: Date.now(),
            profileImage: 'https://randomuser.me/api/portraits/men/76.jpg',
        });

        return messages;
    })();

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === Key.Space) {
            messageInputEl.focus();
        }
    }

    async function handleMessageSend() {
        const formData = new FormData(formEl);
        const message = formData.get("message") as string;

        messageFeed = [...messageFeed, {
            userId: $user.id,
            profileImage: 'https://randomuser.me/api/portraits/men/76.jpg',
            message,
            timestamp: Date.now(),
        }];

        formEl.reset();

        await tick();

        chatArea.scrollTo({top: chatArea.scrollHeight, behavior: "smooth"});
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

        <form class="flex-grow" bind:this={formEl} on:submit|preventDefault={handleMessageSend}>
            <label class="flex flex-1 label">
                <input class="input p-2" type="text" name="message" placeholder="Input" bind:this={messageInputEl}/>
            </label>
        </form>

        <EmoteActions/>
    </div>
</div>
