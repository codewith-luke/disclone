import {User} from "../types";

export class UserCache {
    private _userCache: Map<string, User>;

    constructor() {
        this._userCache = new Map();
    }

    public get(key: string): User | null {
        if (!this._userCache.has(key)) {
            return null
        }

        return this._userCache.get(key) ?? null;
    }

    public set(value: User): void {
        this._userCache.set(value.username, value);
    }

    public delete(key: string): void {
        this._userCache.delete(key);
    }
}