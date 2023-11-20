import type {EmoteFile, EmoteSet, Sizes} from "$lib/emote-parser";

type SevenTvEmoteSetResponse = {
    emotes: SevenTvEmoteSet[];
}

type SevenTvEmoteSet = {
    id: string;
    name: string;
    data: {
        host: {
            url: string;
            files: SevenTvEmoteSetFile[];
        }
    }
}

type SevenTvEmoteSetFile = {
    name: string;
}

export const sevenTvToSizes = {
    '1x': 'small',
    '2x': 'medium',
    '3x': 'large',
    '4x': 'extraLarge',
} as const;

export async function fetchSevenTVEmotes() {
    const emoteSetResponse = await fetch('https://7tv.io/v3/emote-sets/64ee458fd94c28b380c6b927')
        .then(r => r.json() as Promise<SevenTvEmoteSetResponse>)
        .then(r => r.emotes)
        .catch(() => {
            console.error('Failed to fetch 7TV emotes');
            return [] as SevenTvEmoteSet[];
        });

    return emoteSetResponse.reduce((acc: EmoteSet, emote: SevenTvEmoteSet) => {
        const files = emote.data.host.files.reduce((acc: Record<Sizes, EmoteFile>, file: SevenTvEmoteSetFile) => {
            const size = file.name.split('.')[0];
            const imageName = sevenTvToSizes[size];

            acc[imageName] = {
                name: file.name,
                url: `${emote.data.host.url}/${file.name}`
            };

            return acc;
        }, {} as Record<Sizes, EmoteFile>);

        acc[emote.name] = {
            id: emote.id,
            name: emote.name,
            host: emote.data.host.url,
            files
        };

        return acc;
    }, {});
}
