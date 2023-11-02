<script context="module" lang="ts">
    export type IMessage = {
        userId: number;
        displayName: string;
        message: string;
        profileImage: string;
        timestamp: number;
    }
</script>

<script lang="ts">
    import {Avatar} from "@skeletonlabs/skeleton";

    export let userId: number = 0;

    export let message: IMessage = {
        userId: -1,
        displayName: '',
        message: '',
        timestamp: 0,
        profileImage: ''
    }
</script>

<div class="grid grid-cols-[auto_1fr] gap-2">
    <Avatar src="{message.profileImage}"
            width="w-12"/>
    <div class="card p-4 variant-soft rounded-tl-none space-y-2">
        <header class="flex justify-between items-center">
            <p class="font-bold {userId === message.userId ? 'text-amber-400' : 'text-white'}">
                {message.displayName}</p>
            <small class="opacity-50">{new Date(message.timestamp).toLocaleDateString('en-GB')}</small>
        </header>
        <p>{message.message}</p>
    </div>
</div>

