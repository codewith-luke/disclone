<script lang="ts">
    import type {NodeViewProps} from '@tiptap/core';
    import {NodeViewWrapper} from 'svelte-tiptap';

    export let node: NodeViewProps['node'];
    export let updateAttributes: NodeViewProps['updateAttributes'];
</script>

<NodeViewWrapper class="inline">
    <img src="//cdn.7tv.app/emote/6102a37ba57eeb23c0e3e5cb/2x.webp" class="inline-block" alt="">
</NodeViewWrapper>