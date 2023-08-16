<Layout>
    <ChatArea/>
</Layout>

<script type="ts" lang="ts">
    import Layout from "./Layout.svelte";
    import ChatArea from "./lib/ChatArea.svelte";
    import {storePopup} from '@skeletonlabs/skeleton';
    import {computePosition, autoUpdate, offset, shift, flip, arrow} from '@floating-ui/dom';
    import {popup} from '@skeletonlabs/skeleton';

    storePopup.set({computePosition, autoUpdate, offset, shift, flip, arrow});
</script>
