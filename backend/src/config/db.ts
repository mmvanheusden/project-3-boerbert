import {drizzle} from 'drizzle-orm/libsql';

const dbUrl = process.env.DB_URL as string;

const db = drizzle(dbUrl!);

export default db;