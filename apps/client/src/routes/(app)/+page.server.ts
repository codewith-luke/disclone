import type {PageLoad} from './$types';
import {AuthApi} from "disclone-sdk";

export const load: PageLoad = ({locals}) => {
    console.log("data", locals);
    // const authAPI = new AuthApi();

    return {};
};