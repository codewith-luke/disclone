<div class="w-12 h-12"
     use:popup={popupOptions}>
    <ProfileAvatar userID="codingwithluke"/>
</div>

<div class="card p-4 w-72 shadow-xl" data-popup="profileActions">
    <ul>
        <li class="text-hover">
            <button class="flex gap-x-4 w-full">
                <Circle class="text-primary-500"/>
                Active
            </button>
        </li>
    </ul>
</div>

<script lang="ts">
    import {type PopupSettings, popup} from "@skeletonlabs/skeleton";
    import {Circle} from "lucide-svelte";
    import ProfileAvatar from "./ProfileAvatar.svelte";

    const popupOptions: PopupSettings = {
        target: 'profileActions',
        event: 'click',
        placement: 'bottom-start',
        middleware: {
            offset: 20
        }
    };
</script>
