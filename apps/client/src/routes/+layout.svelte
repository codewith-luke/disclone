<script>
    import './styles.css';
    import {initializeStores, storePopup} from '@skeletonlabs/skeleton';
    import {arrow, autoUpdate, computePosition, flip, offset, shift} from '@floating-ui/dom';
    import {initStores} from "$lib/store";

    storePopup.set({computePosition, autoUpdate, offset, shift, flip, arrow});
    initializeStores();
    initStores();
</script>

<div class="h-screen flex flex-col">
    <slot/>
</div>

