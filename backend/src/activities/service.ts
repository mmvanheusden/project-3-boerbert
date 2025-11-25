import {activitiesTable, InsertActivityRequestBody} from './model';
import db from "../config/db";
import {eq} from 'drizzle-orm';
import {Static} from "elysia";


export async function getActivities() {
    return db.select().from(activitiesTable);
}

export async function insertActivity(activity: Static<typeof InsertActivityRequestBody>) {
    await db.insert(activitiesTable).values({
        title: activity.title,
        subtitle: activity.subtitle,
        description: activity.description,
        price: (activity.price as number),
        hero: Buffer.from(await activity.hero.arrayBuffer()),
        capacity: (activity.capacity as number),
        threshold: (activity.threshold as number),
    });
}

export async function updateActivity(id: string, activity: Static<typeof InsertActivityRequestBody>) {
    await db.update(activitiesTable).set({
        title: activity.title,
        subtitle: activity.subtitle,
        description: activity.description,
        price: (activity.price as number),
        hero: Buffer.from(await activity.hero.arrayBuffer()),
        capacity: (activity.capacity as number),
        threshold: (activity.threshold as number),
    }).where(eq(activitiesTable.id, +id));
}

export async function getActivity(id: string) {
    return ((await db.select().from(activitiesTable).where(eq(activitiesTable.id, +id))))[0];
}