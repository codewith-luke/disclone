/* tslint:disable */
/* eslint-disable */
/**
 * Disclone Proxy API
 * Basic API proxy for Disclone
 *
 * The version of the OpenAPI document: 0.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { ErrorResult } from './ErrorResult';
import {
    ErrorResultFromJSON,
    ErrorResultFromJSONTyped,
    ErrorResultToJSON,
} from './ErrorResult';
import type { LoginResponseResult } from './LoginResponseResult';
import {
    LoginResponseResultFromJSON,
    LoginResponseResultFromJSONTyped,
    LoginResponseResultToJSON,
} from './LoginResponseResult';

/**
 * 
 * @export
 * @interface LoginResponse
 */
export interface LoginResponse {
    /**
     * 
     * @type {ErrorResult}
     * @memberof LoginResponse
     */
    error?: ErrorResult;
    /**
     * 
     * @type {LoginResponseResult}
     * @memberof LoginResponse
     */
    result?: LoginResponseResult;
}

/**
 * Check if a given object implements the LoginResponse interface.
 */
export function instanceOfLoginResponse(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function LoginResponseFromJSON(json: any): LoginResponse {
    return LoginResponseFromJSONTyped(json, false);
}

export function LoginResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): LoginResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'error': !exists(json, 'error') ? undefined : ErrorResultFromJSON(json['error']),
        'result': !exists(json, 'result') ? undefined : LoginResponseResultFromJSON(json['result']),
    };
}

export function LoginResponseToJSON(value?: LoginResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'error': ErrorResultToJSON(value.error),
        'result': LoginResponseResultToJSON(value.result),
    };
}

