import {drizzle} from 'drizzle-orm/libsql';
import * as activitiesModel from '../activities/model';

const dbUrl = process.env.DB_URL as string;

// Geef hier de schemas aan Drizzle
const db = drizzle(dbUrl!, {schema: {...activitiesModel}, logger: true});

export default db;