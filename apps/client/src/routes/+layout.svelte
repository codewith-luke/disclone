<script>
    import Header from '$lib/Header.svelte';
    import SideNav from '$lib/SideNav.svelte';
    import './styles.css';
    import {initializeStores, Modal, storePopup} from '@skeletonlabs/skeleton';
    import {arrow, autoUpdate, computePosition, flip, offset, shift} from '@floating-ui/dom';

    storePopup.set({computePosition, autoUpdate, offset, shift, flip, arrow});
    initializeStores();
</script>

<div class="app">
    <Header/>

    <main class="relative flex flex-row h-full overflow-hidden">
        <SideNav/>
        <div class="pl-48 w-full">
            <slot/>
        </div>
    </main>
</div>
<Modal/>

