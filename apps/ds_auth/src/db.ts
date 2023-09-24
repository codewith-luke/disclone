import postgres, {Sql} from 'postgres'

export interface DB {
    readonly query: Sql;
}

export class DB {
    constructor(public readonly query: Sql) {
    }
}

const dbConn = new DB(postgres({
    host: 'localhost',
    port: 5432,
    database: 'disclone',
    username: 'ds_auth',
    password: 'password'
}));

export default dbConn;
