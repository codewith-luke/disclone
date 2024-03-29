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
 * @interface GroupMembersMembersInner
 */
export interface GroupMembersMembersInner {
    /**
     * 
     * @type {string}
     * @memberof GroupMembersMembersInner
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof GroupMembersMembersInner
     */
    username: string;
    /**
     * 
     * @type {string}
     * @memberof GroupMembersMembersInner
     */
    profileImage: string;
    /**
     * 
     * @type {string}
     * @memberof GroupMembersMembersInner
     */
    status: string;
}

/**
 * Check if a given object implements the GroupMembersMembersInner interface.
 */
export function instanceOfGroupMembersMembersInner(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "username" in value;
    isInstance = isInstance && "profileImage" in value;
    isInstance = isInstance && "status" in value;

    return isInstance;
}

export function GroupMembersMembersInnerFromJSON(json: any): GroupMembersMembersInner {
    return GroupMembersMembersInnerFromJSONTyped(json, false);
}

export function GroupMembersMembersInnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): GroupMembersMembersInner {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'username': json['username'],
        'profileImage': json['profileImage'],
        'status': json['status'],
    };
}

export function GroupMembersMembersInnerToJSON(value?: GroupMembersMembersInner | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'username': value.username,
        'profileImage': value.profileImage,
        'status': value.status,
    };
}

