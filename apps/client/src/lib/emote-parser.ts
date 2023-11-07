import {fetchSevenTVEmotes} from "$lib/seven-tv-adapter";

export type EmoteSet = Record<string, Emote>;

export type Emote = {
    name: string;
    host: string;
    files: Record<Sizes, EmoteFile>;
}

export type EmoteFile = {
    name: string;
    url: string;
}

export type Sizes = keyof typeof sizes;

const sizes = {
    small: '1x',
    medium: '2x',
    large: '3x',
    extraLarge: '4x',
} as const;

export function parseMessage(emotes: EmoteSet, message: string) {
    const emoteRegex = /:(.*):/g;
    const emoteMatches = message.matchAll(emoteRegex);
    let parsedMessage = message;

    for (const match of emoteMatches) {
        const emote = match[1];

        if (emotes[emote]) {
            parsedMessage = parsedMessage.replace(match[0], `<img src="${emotes[emote].files.medium.url}" class="inline-block" alt="">`);
        }
    }

    return parsedMessage;
}

export async function fetchEmotes() {
    const emotes = await fetchSevenTVEmotes();
    console.log()
    return emotes;
}
