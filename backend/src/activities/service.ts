import {activitiesTable, InsertActivityRequestBody} from './model';
import db from "../config/db";
import {eq} from 'drizzle-orm';
import {Static} from "elysia";
import * as fs from "node:fs";


export async function getActivities() {
    return db.select().from(activitiesTable);
}

export async function insertActivity(activity: Static<typeof InsertActivityRequestBody>) {
	const buffer = Buffer.from(await activity.hero.arrayBuffer());
	const insertedActivity = await db.insert(activitiesTable).values({
		title: activity.title,
		subtitle: activity.subtitle,
		description: activity.description,
		price: (activity.price as number),
        hero: Buffer.from(await activity.hero.arrayBuffer()),
		capacity: (activity.capacity as number),
		threshold: (activity.threshold as number),
	    minage: (activity.minage as number),
        location: activity.location,
    }).returning();

	// Add image to image storage.
	fs.writeFileSync(`public/${insertedActivity[0].id}.png`, buffer);
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
        minage: (activity.minage as number),
        location: activity.location,
    }).where(eq(activitiesTable.id, +id));
}

export async function getActivity(id: string) {
	const result = ((await db.select().from(activitiesTable).where(eq(activitiesTable.id, +id))))[0];
	if (!result) {
		throw new Error("Activity not found");
	}
	return result;
}