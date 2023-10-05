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
 * @interface LogoutResponse
 */
export interface LogoutResponse {
    /**
     * 
     * @type {string}
     * @memberof LogoutResponse
     */
    id: string;
}

/**
 * Check if a given object implements the LogoutResponse interface.
 */
export function instanceOfLogoutResponse(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;

    return isInstance;
}

export function LogoutResponseFromJSON(json: any): LogoutResponse {
    return LogoutResponseFromJSONTyped(json, false);
}

export function LogoutResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): LogoutResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
    };
}

export function LogoutResponseToJSON(value?: LogoutResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
    };
}
