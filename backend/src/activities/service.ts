import {activitiesTable, InsertActivityRequestBody, UpdateActivityRequestBody} from './model';
import db from "../config/db";
import {DrizzleQueryError, eq} from 'drizzle-orm';
import {Static, status} from "elysia";


export async function getActivities() {
    return db.select().from(activitiesTable);
}

export async function insertActivity(activity: Static<typeof InsertActivityRequestBody>) {
    if (activity.threshold > activity.capacity) {
        return status(400, {
            error: 'Oenemeloen! Capaciteit moet altijd hoger zijn!!!'})
    }
    try {
        await db.insert(activitiesTable).values({
            title: activity.title,
            subtitle: activity.subtitle,
            description: activity.description,
            price: (activity.price as number),
            hero: Buffer.from(await activity.hero.arrayBuffer()),
            capacity: (activity.capacity as number),
            threshold: (activity.threshold as number),
            minage: (activity.minage as number),
            location: activity.location,
        })
    } catch (e) {
        if (e instanceof DrizzleQueryError) {
            if (e.cause?.message.includes('UNIQUE constraint failed')) return status(409, "Een activiteit met deze titel bestaat al.")
        }
    }
}

export async function updateActivity(id: string, activity: Static<typeof UpdateActivityRequestBody>) {
    await db.update(activitiesTable).set({
        title: activity.title,
        subtitle: activity.subtitle,
        description: activity.description,
        price: (activity.price as number),
        hero: (activity.hero ? Buffer.from(await activity.hero.arrayBuffer()) : undefined),
        capacity: (activity.capacity as number),
        threshold: (activity.threshold as number),
        minage: (activity.minage as number),
        location: activity.location,
    }).where(eq(activitiesTable.id, +id));
}

export async function getActivity(id: string) {
    return ((await db.select().from(activitiesTable).where(eq(activitiesTable.id, +id))))[0];
}