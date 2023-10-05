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
 * @interface Message
 */
export interface Message {
    /**
     * 
     * @type {string}
     * @memberof Message
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof Message
     */
    content: string;
    /**
     * 
     * @type {string}
     * @memberof Message
     */
    createdAt: string;
    /**
     * 
     * @type {string}
     * @memberof Message
     */
    updatedAt: string;
    /**
     * 
     * @type {string}
     * @memberof Message
     */
    userId: string;
}

/**
 * Check if a given object implements the Message interface.
 */
export function instanceOfMessage(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "content" in value;
    isInstance = isInstance && "createdAt" in value;
    isInstance = isInstance && "updatedAt" in value;
    isInstance = isInstance && "userId" in value;

    return isInstance;
}

export function MessageFromJSON(json: any): Message {
    return MessageFromJSONTyped(json, false);
}

export function MessageFromJSONTyped(json: any, ignoreDiscriminator: boolean): Message {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'content': json['content'],
        'createdAt': json['createdAt'],
        'updatedAt': json['updatedAt'],
        'userId': json['userId'],
    };
}

export function MessageToJSON(value?: Message | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'content': value.content,
        'createdAt': value.createdAt,
        'updatedAt': value.updatedAt,
        'userId': value.userId,
    };
}

