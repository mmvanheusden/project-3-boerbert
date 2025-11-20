import {activitiesTable, InsertActivityRequestBody} from './model';
import db from "../config/db";
import {eq} from 'drizzle-orm';
import {Static} from "elysia";


export async function getActivities() {
    return db.select().from(activitiesTable);
}

export async function insertActivity(activity: Static<typeof InsertActivityRequestBody>) {
    // Convert image into Uint8Array
    const heroBytes = new Uint8Array(await activity.hero.arrayBuffer());


    await db.insert(activitiesTable).values({
        title: activity.title,
        subtitle: activity.subtitle,
        description: activity.description,
        price: (activity.price as number),
        hero: heroBytes,
        capacity: (activity.capacity as number),
        threshold: (activity.threshold as number),
    });
}

export async function getActivity(id: string) {
    return db.select().from(activitiesTable).where(eq(activitiesTable.id, +id));
}