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
 * @interface AnyValue
 */
export interface AnyValue {
}

/**
 * Check if a given object implements the AnyValue interface.
 */
export function instanceOfAnyValue(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function AnyValueFromJSON(json: any): AnyValue {
    return AnyValueFromJSONTyped(json, false);
}

export function AnyValueFromJSONTyped(json: any, ignoreDiscriminator: boolean): AnyValue {
    return json;
}

export function AnyValueToJSON(value?: AnyValue | null): any {
    return value;
}

