import MYSQL from "../config/config";
import mysql, { Pool } from "mysql2/promise";

const dbConfig = MYSQL.database;

export class DBConnection {
    private _pool: Pool;

    constructor() {
        this._pool = mysql.createPool({
            host: dbConfig.MYSQL_HOST,
            user: dbConfig.MYSQL_USER,
            password: dbConfig.MYSQL_PW,
            database: dbConfig.MYSQL_DB,
            port: dbConfig.MYSQL_PORT
        });
        console.log("연결됨");
    }

    query = async (sql: string): Promise<[any, any]> => {
        const [result, fields] = await this._pool.execute(sql);
        return [result as any, fields];
    };

    close = () => {
        this._pool?.end();
    };
}

const db = new DBConnection();
export default db; 