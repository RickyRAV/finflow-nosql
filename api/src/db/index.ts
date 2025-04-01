import { Database, aql } from "arangojs";
import { Context } from "hono";

export const createDb = async (c: Context) => {
    const db = new Database({
        url: c.env.URL,
        databaseName: c.env.DATABASE,
        auth: { username: c.env.USERNAME, password: c.env.PASSWORD },
    });
    return db;
}

export { aql };

export const testConnection = async (c: Context) => {
    try {
        const db = await createDb(c);
        await db.version();
        return true;
    } catch (error) {
        console.error("Database connection failed:", error);
        return false;
    }
}