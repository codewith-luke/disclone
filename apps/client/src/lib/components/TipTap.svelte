<script lang="ts">
    import {onMount, onDestroy, createEventDispatcher} from 'svelte';
    import {Key} from "w3c-keys";
    import {Editor, Node, mergeAttributes, nodeInputRule} from '@tiptap/core'
    import StarterKit from '@tiptap/starter-kit'
    import {BulletList} from "@tiptap/extension-bullet-list";
    import {getEmoteUrl} from "$lib/emote-parser";
    import {getEmoteStore} from "$lib/store";

    let element
    let editor

    export const emoteAdded = function (data) {
        editor.commands.insertContent(`:${data}:`,
            {
                parseOptions: {
                    preserveWhitespace: false,
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
        const CustomExtension = Node.create({
            name: 'image',

            addOptions() {
                return {
                    inline: false,
                    allowBase64: false,
                    HTMLAttributes: {},
                }
            },

            inline() {
                return this.options.inline
            },

            group() {
                return this.options.inline ? 'inline' : 'block'
            },

            draggable: true,

            addAttributes() {
                return {
                    src: {
                        default: null,
                    },
                    alt: {
                        default: null,
                    },
                    title: {
                        default: null,
                    },
                }
            },

            parseHTML() {
                return [
                    {
                        tag: this.options.allowBase64
                            ? 'img[src]'
                            : 'img[src]:not([src^="data:"])',
                    },
                ]
            },

            renderText({node}) {
                return node.attrs.alt || node.attrs.title || ''
            },

            renderHTML({HTMLAttributes}) {
                return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
            },

            // addCommands() {
            //     return {
            //         setImage: options => ({commands}) => {
            //             return commands.insertContent({
            //                 type: this.name,
            //                 attrs: options,
            //             })
            //         },
            //     }
            // },

            addInputRules() {
                const emoteRegex = /:(.*?):/gm;
                return [
                    nodeInputRule({
                        find: emoteRegex,
                        type: this.type,
                        getAttributes: (match) => {
                            const [, name] = match;
                            const src = getEmoteUrl($emotes, "small", name)
                            const alt = name;
                            const title = name;

                            return {src, alt, title}
                        },
                    }),
                ]
            },
        });

        editor = new Editor({
            element,
            extensions: [
                StarterKit.configure({
                    bulletList: false
                }),
                CustomBulletList,
                CustomExtension,
            ],
            content: '',
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
        white-space: pre;
    }
</style>