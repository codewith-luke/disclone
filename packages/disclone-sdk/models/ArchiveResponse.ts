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
 * @interface ArchiveResponse
 */
export interface ArchiveResponse {
    /**
     * 
     * @type {number}
     * @memberof ArchiveResponse
     */
    userID: number;
}

/**
 * Check if a given object implements the ArchiveResponse interface.
 */
export function instanceOfArchiveResponse(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "userID" in value;

    return isInstance;
}

export function ArchiveResponseFromJSON(json: any): ArchiveResponse {
    return ArchiveResponseFromJSONTyped(json, false);
}

export function ArchiveResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ArchiveResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'userID': json['userID'],
    };
}

export function ArchiveResponseToJSON(value?: ArchiveResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'userID': value.userID,
    };
}

