import {activitiesTable, InsertActivityRequestBody, UpdateActivityRequestBody} from './model';
import db from "../config/db";
import * as fs from "node:fs";
import {DrizzleQueryError, eq} from 'drizzle-orm';
import {Static, status} from "elysia";
import translate from "translate";


export async function vertaal(text: string): Promise<{ nl: string, en: string, de: string }> {
    // return {
    //     nl: text,
    //     en: "a",
    //     de: "b"
    // }
    const german = await translate(text, {
        from: "nl",
        to: "de",
    })
    console.trace(german)

    const english = await translate(text, {
        from: "nl",
        to: "en",
    })
    console.trace(english)

    return {
        nl: text,
        en: english,
        de: german
    }

}

export async function getActivities() {
    return db.select().from(activitiesTable);
}

export async function insertActivity(activity: Static<typeof InsertActivityRequestBody>) {
    validateActivity(activity);

    try {
		const imageBuffer = Buffer.from(await activity.hero.arrayBuffer());
        // TODO: (future proof): mocht de vertalingsdienst kapot gaan, alles in Nederlands ipv niks doen
        const insertedActivity = await db.insert(activitiesTable).values({
            title: await vertaal(activity.title),
            subtitle: await vertaal(activity.subtitle),
            description: await vertaal(activity.description),
            price: (activity.price as number),
            capacity: (activity.capacity as number),
            threshold: (activity.threshold as number),
            minage: activity.minage,
            location: await vertaal(activity.location),
            type: (activity.type),
            latitude: activity.latitude,
            longitude: activity.longitude,
            targetAudience: activity.targetAudience,
        }).returning();

		// Add image to image storage.
		fs.writeFileSync(`public/activities/${insertedActivity[0].id}.png`, imageBuffer);
    } catch (e) {
        if (e instanceof DrizzleQueryError) {
            if (e.cause?.message.includes('UNIQUE constraint failed')) return status(409, "Een activiteit met deze titel bestaat al.")
        } else {
            // wrs een vertalingserror (te veel verzoeken naar vertalingsdienst)
            return status(500, "Er is een onbekende fout opgetreden.")
        }
    }
}

export async function updateActivity(id: string, activity: Static<typeof UpdateActivityRequestBody>) {
    validateActivity(activity);

    await db.update(activitiesTable).set({
        title: await vertaal(activity.title),
        subtitle: await vertaal(activity.subtitle),
        description: await vertaal(activity.description),
        price: (activity.price as number),
        capacity: (activity.capacity as number),
        threshold: (activity.threshold as number),
        minage: activity.minage,
        location: await vertaal(activity.location),
        type: activity.type,
        targetAudience: activity.targetAudience,
        latitude: activity.latitude,
        longitude: activity.longitude,
    }).where(eq(activitiesTable.id, +id));
}

export async function getActivity(id: string) {
	const result = ((await db.select().from(activitiesTable).where(eq(activitiesTable.id, +id))))[0];
	if (!result) {
		throw new Error("Activity not found");
	}
	return result;
}


// Valideer de gegevens van de activiteit
function validateActivity(activity: Static<typeof InsertActivityRequestBody | typeof UpdateActivityRequestBody>) {
    if (activity.threshold > activity.capacity) {
        return status(400, {
            error: 'Oenemeloen! Capaciteit moet altijd hoger zijn!!!'})
    }

    if (!(isLatitude(activity.latitude) && isLongitude(activity.longitude))) {
        return status(400, "Latitude en/of longitude zijn ongeldig.")
    }
}

// Source - https://stackoverflow.com/a/66126875
// Posted by Bhad Guy
// Retrieved 2026-01-10, License - CC BY-SA 4.0
function isLatitude(latitude: number) {
    return isFinite(latitude) && Math.abs(latitude) <= 90;
}
function isLongitude(longitude: number) {
    return isFinite(longitude) && Math.abs(longitude) <= 180;
}