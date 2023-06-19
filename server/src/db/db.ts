import MYSQL from "../config/config";
import mysql, { Pool, PoolConnection } from "mysql2/promise";

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
        // console.log("연결됨");
    }

    startTransaction = async (): Promise<PoolConnection> => {
        const connection = await this._pool.getConnection();
        connection.beginTransaction;
        return connection;
    };

    commitTransaction = async (connection: PoolConnection) => {
        await connection.commit();
        connection.release();
    };

    rollbackTransaction = async (connection: PoolConnection) => {
        await connection.rollback();
        connection.release();
    };

    query = async (connection: PoolConnection, sql: string): Promise<[any, any]> => {
        const [result, fields] = await connection.execute(sql);
        return [result as any, fields];
    };

    close = () => {
        this._pool?.end();
    };
}

// 기존 코드
const db = new DBConnection();
const queryTransaction = async (sql: string) => {
    const connection = await db.startTransaction();
    try {
        const [result, _] = await db.query(connection, sql);
        await db.commitTransaction(connection);
        return result;
    } catch (err) {
        await db.rollbackTransaction(connection);
        console.log("Transaction rolled back due to error:", err);
    } finally {
        connection.release();
    }
};



export { db, queryTransaction };