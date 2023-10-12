<script>
    import {setContext} from 'svelte';
    import {writable} from 'svelte/store';
    import './styles.css';
    import {initializeStores, storePopup} from '@skeletonlabs/skeleton';
    import {arrow, autoUpdate, computePosition, flip, offset, shift} from '@floating-ui/dom';

    storePopup.set({computePosition, autoUpdate, offset, shift, flip, arrow});
    initializeStores();

    const user = writable();

    setContext('user', user);
</script>

<div class="h-screen flex flex-col">
    <slot/>
</div>

