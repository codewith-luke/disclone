<script>
    import Header from '$lib/Header.svelte';
    import SideNav from "$lib/SideNav.svelte";
    import './styles.css';
    import {initializeStores, Modal, storePopup} from "@skeletonlabs/skeleton";
    import {arrow, autoUpdate, computePosition, flip, offset, shift} from "@floating-ui/dom";

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

<!--<style>-->
<!--    .app {-->
<!--        display: flex;-->
<!--        flex-direction: column;-->
<!--        min-height: 100vh;-->
<!--    }-->

<!--    main {-->
<!--        flex: 1;-->
<!--        display: flex;-->
<!--        flex-direction: column;-->
<!--        padding: 1rem;-->
<!--        width: 100%;-->
<!--        max-width: 64rem;-->
<!--        margin: 0 auto;-->
<!--        box-sizing: border-box;-->
<!--    }-->

<!--    footer {-->
<!--        display: flex;-->
<!--        flex-direction: column;-->
<!--        justify-content: center;-->
<!--        align-items: center;-->
<!--        padding: 12px;-->
<!--    }-->

<!--    footer a {-->
<!--        font-weight: bold;-->
<!--    }-->

<!--    @media (min-width: 480px) {-->
<!--        footer {-->
<!--            padding: 12px 0;-->
<!--        }-->
<!--    }-->
<!--</style>-->
