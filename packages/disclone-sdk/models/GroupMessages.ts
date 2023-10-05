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
import type { Message } from './Message';
import {
    MessageFromJSON,
    MessageFromJSONTyped,
    MessageToJSON,
} from './Message';

/**
 * 
 * @export
 * @interface GroupMessages
 */
export interface GroupMessages {
    /**
     * 
     * @type {Array<Message>}
     * @memberof GroupMessages
     */
    messages: Array<Message>;
}

/**
 * Check if a given object implements the GroupMessages interface.
 */
export function instanceOfGroupMessages(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "messages" in value;

    return isInstance;
}

export function GroupMessagesFromJSON(json: any): GroupMessages {
    return GroupMessagesFromJSONTyped(json, false);
}

export function GroupMessagesFromJSONTyped(json: any, ignoreDiscriminator: boolean): GroupMessages {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'messages': ((json['messages'] as Array<any>).map(MessageFromJSON)),
    };
}

export function GroupMessagesToJSON(value?: GroupMessages | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'messages': ((value.messages as Array<any>).map(MessageToJSON)),
    };
}
