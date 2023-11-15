<script lang="ts">
    import {onMount, onDestroy, createEventDispatcher} from 'svelte';
    import {Key} from "w3c-keys";
    import {Editor, Node, mergeAttributes, nodeInputRule, Extension} from '@tiptap/core'
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
        const Image = Node.create({
            name: 'image',

            group: 'inline',
            inline: true,

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
                    'data-tag': {
                        default: null,
                    },
                    class: {
                        default: 'inline',
                    }
                }
            },

            parseHTML() {
                return [{
                    tag: 'img[src]'
                }]
            },

            renderHTML(data) {
                return ['img', mergeAttributes(this.options.HTMLAttributes, data.HTMLAttributes), 0]
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

                            const alt = name;
                            const title = name;

                            return {
                                'data-tag': `:${name}:`,
                                src,
                                alt,
                                title
                            }
                        },
                    }),
                ]
            },
        });

        editor = new Editor({
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