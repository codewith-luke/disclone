import postgres from 'postgres'

const sql = postgres({
    host: 'localhost',
    port: 5432,
    database: 'disclone',
    username: 'ds_auth',
    password: 'password'
});

export default sql