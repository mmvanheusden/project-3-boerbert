import {drizzle} from 'drizzle-orm/libsql';
import * as activitiesModel from '../activities/model';
import * as slideshowModel from '../slideshow/model';
import {createClient} from "@libsql/client";

const client = createClient({
	url: process.env.TURSO_DATABASE_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN!
});
const db = drizzle({ client, logger: true, schema: {...activitiesModel, ...slideshowModel} });

export default db;