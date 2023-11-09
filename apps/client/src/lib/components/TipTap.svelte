<script>
    import {onMount, onDestroy, createEventDispatcher} from 'svelte';
    import {Key} from "w3c-keys";
    import {Editor} from '@tiptap/core'
    import StarterKit from '@tiptap/starter-kit'
    import {BulletList} from "@tiptap/extension-bullet-list";

    let element
    let editor

    const dispatch = createEventDispatcher();

    const CustomBulletList = BulletList.extend({
        addKeyboardShortcuts() {
            return {
                [Key.Enter]: () => {
                    dispatch('send', this.editor.getJSON());
                    return this.editor.commands.clearContent();
                },
            }
        },
    })

    onMount(() => {
        editor = new Editor({
            element,
            extensions: [
                StarterKit.configure({
                    bulletList: false
                }),
                CustomBulletList
            ],
            content: 'Hello world \n\n test',
            autofocus: true,
            editable: true,
            injectCSS: false,
            parseOptions: {
                preserveWhitespace: 'full',
            }
        })
    })

    onDestroy(() => {
        if (editor) {
            editor.destroy()
        }
    })
</script>

<div id="tippy" class="flex-grow" bind:this={element}/>

<style>
    #tippy {
        /*height: 100%;*/
        /*width: 100%;*/
        white-space: pre;
    }
</style>