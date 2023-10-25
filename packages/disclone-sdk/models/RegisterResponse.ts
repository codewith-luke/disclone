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
import type { RegisterResponseResult } from './RegisterResponseResult';
import {
    RegisterResponseResultFromJSON,
    RegisterResponseResultFromJSONTyped,
    RegisterResponseResultToJSON,
} from './RegisterResponseResult';

/**
 * 
 * @export
 * @interface RegisterResponse
 */
export interface RegisterResponse {
    /**
     * 
     * @type {ErrorResult}
     * @memberof RegisterResponse
     */
    error?: ErrorResult;
    /**
     * 
     * @type {RegisterResponseResult}
     * @memberof RegisterResponse
     */
    result?: RegisterResponseResult;
}

/**
 * Check if a given object implements the RegisterResponse interface.
 */
export function instanceOfRegisterResponse(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RegisterResponseFromJSON(json: any): RegisterResponse {
    return RegisterResponseFromJSONTyped(json, false);
}

export function RegisterResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): RegisterResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'error': !exists(json, 'error') ? undefined : ErrorResultFromJSON(json['error']),
        'result': !exists(json, 'result') ? undefined : RegisterResponseResultFromJSON(json['result']),
    };
}

export function RegisterResponseToJSON(value?: RegisterResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'error': ErrorResultToJSON(value.error),
        'result': RegisterResponseResultToJSON(value.result),
    };
}

