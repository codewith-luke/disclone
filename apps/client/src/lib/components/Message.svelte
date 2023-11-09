<script context="module" lang="ts">
    export type IMessage = {
        userId: number;
        message: any;
        profileImage: string;
        timestamp: number;
    }
</script>

<script lang="ts">
    import {Avatar} from "@skeletonlabs/skeleton";
    import {getEmoteStore} from "$lib/store";
    import {parseMessage} from "$lib/emote-parser";
    import {Schema, DOMSerializer} from "@tiptap/pm/model";

    const emotes = getEmoteStore();
    export let userId: number = 0;
    export let displayName: string = '';

    export let message = {}

    const textSchema = new Schema({
        nodes: {
            text: {
                whitespace: "pre",
                toDOM(node) {
                    const msg = parseMessage($emotes, node.text);
                    return msg
                },
            },
            doc: {content: "text*"},
        }
    });

    const node = textSchema.text(message.message);
    const messageElement = document.createElement('div');
    const mes = DOMSerializer.fromSchema(textSchema).serializeNode(node);
    messageElement.appendChild(mes);
    const parsedMessage = messageElement.innerHTML;

    // const parsedMessage = parseMessage($emotes, htmlString);
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
        {@html parsedMessage}
<!--        <span>-->
<!--            -->
<!--        </span>-->
    </div>
</div>

