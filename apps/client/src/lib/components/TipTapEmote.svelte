<script lang="ts">
    import type {NodeViewProps} from '@tiptap/core';
    import {NodeViewWrapper} from 'svelte-tiptap';

    export let editor: NodeViewProps['editor'];
    export let decorations: NodeViewProps['decorations'];
    export let selected: NodeViewProps['selected'];
    export let extension: NodeViewProps['extension'];
    export let getPos: NodeViewProps['getPos'];
    export let deleteNode: NodeViewProps['deleteNode'];
    export let node: NodeViewProps['node'];
    export let updateAttributes: NodeViewProps['updateAttributes'];

    editor.on('selectionUpdate', (data) => {
        console.log(data.transaction)
    })
</script>

<NodeViewWrapper class="inline">
    {#if !node.attrs.src}
        <p class="inline">{node.attrs.tag}</p>
    {:else}
        <img src={node.attrs.src} class="inline" alt={node.attrs.alt} data-tag={node.attrs.tag}>
    {/if}
</NodeViewWrapper>