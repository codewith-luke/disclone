import {AuthApi, ProfileApi} from "disclone-sdk";
import {Configuration} from "disclone-sdk/runtime";

export interface APIBridge {
    authApi: AuthApi;
    profileApi: ProfileApi;
}

let apiBridgeCache: null | APIBridge = null;

export function createAPIBridge() {
    if (apiBridgeCache) {
        console.log('Using cached API bridge');
        return apiBridgeCache;
    }

    const config = new Configuration({
        credentials: 'include',
    });

    const authApi = new AuthApi(config);
    const profileApi = new ProfileApi(config);

    apiBridgeCache = {
        profileApi,
        authApi
    }

    return apiBridgeCache;
}