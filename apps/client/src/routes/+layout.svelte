<script>
    import Header from '$lib/Header.svelte';
    import SideNav from '$lib/SideNav.svelte';
    import './styles.css';
    import {initializeStores, Modal, storePopup} from '@skeletonlabs/skeleton';
    import {arrow, autoUpdate, computePosition, flip, offset, shift} from '@floating-ui/dom';

    storePopup.set({computePosition, autoUpdate, offset, shift, flip, arrow});
    initializeStores();
</script>

<div class="h-screen flex flex-col">
    <Header/>

    <div class="flex flex-1 overflow-hidden">
        <SideNav/>
        <div class="w-full">
            <slot/>
        </div>
    </div>
</div>

<Modal/>

<style>
    html,
    body {
        min-height: 100%;
    }
</style>
