<div>
    <button use:popup={popupOptions}>
        <PlusCircle class="text-hover"/>
    </button>

    <div class="card p-4 shadow-xl" data-popup="uploadActions">
        <button class="flex items-center gap-x-2 hover:text-secondary-400">
            <Upload/>
            Upload
        </button>
        <div class="arrow bg-surface-100-800-token"/>
    </div>
</div>

<script lang="ts">
    import {PlusCircle, Upload} from "lucide-svelte";
    import {type PopupSettings, popup} from "@skeletonlabs/skeleton";

    const popupOptions: PopupSettings = {
        target: 'uploadActions',
        event: 'click',
        placement: 'top',
    };
</script>