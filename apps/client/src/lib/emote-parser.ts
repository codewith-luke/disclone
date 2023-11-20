import {fetchSevenTVEmotes} from "$lib/seven-tv-adapter";

export type EmoteSet = Record<string, Emote>;

export type Emote = {
    id: string;
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

export function getEmoteUrl(emotes: EmoteSet, size: Sizes, emoteString: string) {
    const emote = emoteString.split(':')[1] ? emoteString.split(':')[1] : emoteString;
    if (!emotes[emote]) return null;

    return emotes[emote].files[size].url;
}

export function parseMessage(emotes: EmoteSet, message: string) {
    const emoteRegex = /:(.*?):/gm;
    const emoteMatches = message.matchAll(emoteRegex);
    let parsedMessage = message;

    for (const match of emoteMatches) {
        const emote = match[1];

        if (emotes[emote]) {
            const url = getEmoteUrl(emotes, 'medium', emote);
            if (!url) continue;
            parsedMessage = parsedMessage.replace(match[0], `<img src="${url}" class="inline-block" alt="">`);
        }
    }

    return parsedMessage;
}

export async function fetchEmotes() {
    const emotes = await fetchSevenTVEmotes();
    return emotes;
}
