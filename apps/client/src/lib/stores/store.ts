import {writable, type Writable} from "svelte/store";
import {setContext} from "svelte";
import type {User} from "disclone-sdk/models";

export type UserStore = Writable<User>;

const userStore = writable({
    id: 0,
    username: '',
});

userStore.subscribe((user) => {
    console.log(user);
});

export function getUserStore() {
    return setContext('user', userStore) as UserStore;
}

export function initStores() {
    setContext('user', userStore);
}

