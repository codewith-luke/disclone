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
/**
 * 
 * @export
 * @interface ErrorResultError
 */
export interface ErrorResultError {
    /**
     * 
     * @type {number}
     * @memberof ErrorResultError
     */
    status: number;
    /**
     * 
     * @type {string}
     * @memberof ErrorResultError
     */
    message: string;
}

/**
 * Check if a given object implements the ErrorResultError interface.
 */
export function instanceOfErrorResultError(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "status" in value;
    isInstance = isInstance && "message" in value;

    return isInstance;
}

export function ErrorResultErrorFromJSON(json: any): ErrorResultError {
    return ErrorResultErrorFromJSONTyped(json, false);
}

export function ErrorResultErrorFromJSONTyped(json: any, ignoreDiscriminator: boolean): ErrorResultError {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'status': json['status'],
        'message': json['message'],
    };
}

export function ErrorResultErrorToJSON(value?: ErrorResultError | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'status': value.status,
        'message': value.message,
    };
}

