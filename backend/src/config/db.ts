import { drizzle } from "drizzle-orm/libsql/web";
import * as activitiesModel from '../activities/model';
import * as slideshowModel from '../slideshow/model';
import * as slotsModel from '../slots/model';
import * as bookingsmodel from '../bookings/model';

const db = drizzle({ connection: {
		url: process.env.TURSO_DATABASE_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN!
	},
	logger: process.env.DRIZZLE_LOGGER == "true" || false,
	schema: {...activitiesModel, ...slideshowModel, ...slotsModel, ...bookingsmodel
}});

export default db;