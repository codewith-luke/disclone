import {writable, type Writable} from "svelte/store";
import {getContext, setContext} from "svelte";
import type {User} from "../../../../packages/disclone-sdk/models";
import type {EmoteSet} from "$lib/emote-parser";

export type UserStore = Writable<User>;
export type EmoteStore = Writable<EmoteSet>;

const userStore = writable({});
const emoteStore = writable({});

export function getUserStore() {
    return getContext('user') as UserStore;
}

export function getEmoteStore() {
    return getContext('emote') as EmoteStore;
}

export async function initStores() {
    setContext('user', userStore);
    setContext('emote', emoteStore);
}

