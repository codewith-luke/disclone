import postgres, {Sql} from 'postgres'

export interface DB {
    readonly query: Sql;
}
export class DB {
    constructor(public readonly query: Sql) {}

    async end() {
        await this.query.end({timeout: 5})
    }
}

export default function createDBConn() {
    console.log("loading db conn to", Bun.env.POSTGRES_HOST);

    const pg = postgres({
        host: Bun.env.POSTGRES_HOST,
        port: Bun.env.POSTGRES_PORT,
        database: Bun.env.POSTGRES_DB,
        username: Bun.env.POSTGRES_USER,
        password: Bun.env.POSTGRES_PASSWORD,
    });

    return new DB(pg);
}


