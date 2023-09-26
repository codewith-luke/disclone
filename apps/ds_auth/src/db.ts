import postgres, {Sql} from 'postgres'

export interface DB {
    readonly query: Sql;
}

export class DB {
    constructor(public readonly query: Sql) {
    }

    async end() {
        await this.query.end({ timeout: 5 })
    }
}

export default function createDBConn() {
    const pg = postgres({
        host: 'localhost',
        port: 5432,
        database: 'disclone',
        username: 'ds_auth',
        password: 'password'
    });

    return new DB(pg);
}


