import {activitiesTable} from './model';
import db from "../config/db";
import {eq} from 'drizzle-orm';


export async function getActivities() {
    return db.select().from(activitiesTable);
}

export async function getActivity(id: string) {
    return db.select().from(activitiesTable).where(eq(activitiesTable.id, +id));
}