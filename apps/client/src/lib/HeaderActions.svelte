<div class="flex flex-row text-surface-400 gap-x-4 bg-surface-800 py-2 px-4 rounded-lg">
    <button class="text-hover" use:popup={popupNotifications}>
        <Bell/>
    </button>
    <button class="text-hover">
        <SmilePlus class="text-hover"/>
    </button>
    <button class="text-hover" use:popup={popupMoreActions}>
        <MoreVertical class="text-hover"/>
    </button>

    <div class="card p-4 w-72 shadow-xl" data-popup="moreActions">
        More Actions
    </div>

    <div class="w-80 shadow-xl rounded-lg overflow-hidden bg-surface-900" data-popup="notifications">
        <div class="flex justify-between bg-surface-950 p-4 text-tertiary-100">
            <div class="flex gap-x-2">
                <Bell class="w-4"/>
                Notifications
            </div>
            <button class="underline">
                clear all
            </button>
        </div>

        <section class="p-2">
            <ul class="list space-y-4">
                <li class="group hover:bg-surface-950 rounded-sm">
                    <MessageCircle/>
                    <span class="flex-auto">You received a message from <b>Bob</b></span>
                    <X class="opacity-0 group-hover:opacity-100"/>
                </li>
                <li class="group hover:bg-surface-950">
                    <SmilePlusIcon/>
                    <span class="flex-auto"><b>Bob</b> added you to their friends list!</span>
                    <X class="opacity-0 group-hover:opacity-100"/>
                </li>
            </ul>
        </section>
    </div>
</div>

<script lang="ts">
    import {type PopupSettings, popup} from "@skeletonlabs/skeleton";
    import {Bell, SmilePlus, MoreVertical, MessageCircle, SmilePlusIcon, X} from 'lucide-svelte';

    type PickedOptions = Pick<PopupSettings, ['event', 'placement', 'middleware']>;

    const popupOptions: PickedOptions = {
        event: 'click',
        placement: 'bottom-end',
        middleware: {
            offset: 20
        }
    };

    const popupMoreActions: PopupSettings = {
        ...popupOptions,
        target: 'moreActions'
    };

    const popupNotifications: PopupSettings = {
        ...popupOptions,
        target: 'notifications'
    };
</script>

<style>
    .list li {
        @apply rounded-md p-4 cursor-pointer;
    }
</style>
