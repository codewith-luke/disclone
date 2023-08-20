<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app"/>
</svelte:head>

<Layout>
    <ChatArea/>
</Layout>

<script lang="ts">
    import Layout from "../lib/Layout.svelte";
    import ChatArea from "../lib/ChatArea.svelte";
</script>

