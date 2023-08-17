<Layout>
    <ChatArea/>
</Layout>
<Modal />

<script type="ts" lang="ts">
    import Layout from "./Layout.svelte";
    import ChatArea from "./lib/ChatArea.svelte";
    import {Modal, storePopup, initializeStores} from '@skeletonlabs/skeleton';
    import {computePosition, autoUpdate, offset, shift, flip, arrow} from '@floating-ui/dom';

    storePopup.set({computePosition, autoUpdate, offset, shift, flip, arrow});
    initializeStores();
</script>
