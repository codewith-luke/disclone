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

    const emotes = {
        peepoDJ: 'https://cdn.7tv.app/emote/6102a37ba57eeb23c0e3e5cb/2x.avif',
    }

    export let userId: number = 0;
    export let displayName: string = '';

    export let message: IMessage = {
        userId: -1,
        message: '',
        timestamp: 0,
        profileImage: ''
    }

    function parseMessage(message: string) {
        const emoteRegex = /:(\w+):/g;
        const emoteMatches = message.matchAll(emoteRegex);
        let parsedMessage = message;

        for (const match of emoteMatches) {
            const emote = match[1];

            if (emotes[emote]) {
                parsedMessage = parsedMessage.replace(match[0], `<img src="${emotes[emote]}" class="inline-block w-6 h-6" alt="">`);
            }
        }
        return parsedMessage;
    }
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
        <p>{@html parseMessage(message.message)}</p>
    </div>
</div>

