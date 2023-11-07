<script context="module" lang="ts">
    export type IMessage = {
        userId: number;
        message: string;
        profileImage: string;
        timestamp: number;
    }
</script>

<script lang="ts">
    import {Avatar} from "@skeletonlabs/skeleton";
    import {getEmoteStore} from "$lib/store";
    import {parseMessage} from "$lib/emote-parser";

    const emotes = getEmoteStore();
    export let userId: number = 0;
    export let displayName: string = '';

    export let message: IMessage = {
        userId: -1,
        message: '',
        timestamp: 0,
        profileImage: ''
    }

    const parsedMessage = parseMessage($emotes, message.message);
</script>

<div class="grid grid-cols-[auto_1fr] gap-2">
    <Avatar src="{message.profileImage}"
            width="w-12"/>
    <div class="card p-4 variant-soft rounded-tl-none space-y-2">
        <header class="flex justify-between items-center">
            <p class="font-bold {userId === message.userId ? 'text-amber-400' : 'text-white'}">
                {displayName}</p>
            <small class="opacity-50">{new Date(message.timestamp).toLocaleDateString('en-GB')}</small>
        </header>
        <p>{@html parsedMessage}</p>
    </div>
</div>

