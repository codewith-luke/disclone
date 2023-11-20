<script lang="ts">
    import {onMount, onDestroy, createEventDispatcher} from 'svelte';
    import {Key} from "w3c-keys";
    import {createEditor, SvelteNodeViewRenderer, BubbleMenu} from 'svelte-tiptap';
    import {Node, mergeAttributes, nodeInputRule} from '@tiptap/core'
    import StarterKit from '@tiptap/starter-kit'
    import {BulletList} from "@tiptap/extension-bullet-list";
    import {getEmoteUrl} from "$lib/emote-parser";
    import {getEmoteStore} from "$lib/store";
    import TipTapEmote from "$lib/components/TipTapEmote.svelte";

    let element;
    let editor;

    export const emoteAdded = function (data) {
        editor.commands.insertContent(`:${data}:`,
            {
                parseOptions: {
                    preserveWhitespace: true,
                }
            });
    }

    const emotes = getEmoteStore();
    const dispatch = createEventDispatcher();

    const CustomBulletList = BulletList.extend({
        addKeyboardShortcuts() {
            return {
                [Key.Enter]: () => {
                    dispatch('send', this.editor.getText());

                    return this.editor.commands.clearContent();
                },
            }
        },
    })

    onMount(() => {
        const Image = Node.create({
            name: 'image',

            group: 'block',
            atom: true,

            addAttributes() {
                return {
                    src: {
                        default: null,
                    },
                    alt: {
                        default: null,
                    },
                    tag: {
                        default: null,
                    },
                }
            },

            parseHTML() {
                return [{tag: 'TipTapEmote'}];
            },

            renderHTML({HTMLAttributes}) {
                if (!HTMLAttributes.src) {
                    return
                }

                return ['TipTapEmote', mergeAttributes(HTMLAttributes)];
            },

            addNodeView() {
                return SvelteNodeViewRenderer(TipTapEmote);
            },

            addInputRules() {
                const emoteRegex = /:.*?:/gm;
                return [
                    nodeInputRule({
                        find: emoteRegex,
                        type: this.type,
                        getAttributes: (match) => {
                            const [name] = match;
                            const src = getEmoteUrl($emotes, "small", name);

                            const alt = name.split(":")[1];

                            return {
                                tag: name,
                                src,
                                alt,
                            }
                        },
                    }),
                ]
            },
        });

        editor = createEditor({
            element,
            extensions: [
                StarterKit.configure({
                    bulletList: false,
                    paragraph: {
                        HTMLAttributes: {
                            class: 'inline'
                        }
                    },
                }),
                CustomBulletList,
                Image,
            ],
            content: '',
            autofocus: true,
            editable: true,
            injectCSS: true,
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
        white-space: pre;
    }
</style>