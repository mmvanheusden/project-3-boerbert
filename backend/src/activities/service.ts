import {activitiesTable, InsertActivityRequestBody, UpdateActivityRequestBody} from './model';
import db from "../config/db";
import {DrizzleQueryError, eq} from 'drizzle-orm';
import {Static, status} from "elysia";
import translate from '@sckt/translate'


export async function vertaal(text: string): Promise<{ nl: string, en: string, de: string }> {
    // return {
    //     nl: text,
    //     en: "a",
    //     de: "b"
    // }
    const german = await translate(text, {
        from: "nl",
        to: "de",
        engine: "simplytranslate"
    })
    console.trace(german)

    const english = await translate(text, {
        from: "nl",
        to: "en",
        engine: "simplytranslate"
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
    if (activity.threshold > activity.capacity) {
        return status(400, {
            error: 'Oenemeloen! Capaciteit moet altijd hoger zijn!!!'})
    }
    try {
        // TODO: (future proof): mocht de vertalingsdienst kapot gaan, alles in Nederlands ipv niks doen
        await db.insert(activitiesTable).values({
            title: await vertaal(activity.title),
            subtitle: await vertaal(activity.subtitle),
            description: await vertaal(activity.description),
            price: (activity.price as number),
            hero: Buffer.from(await activity.hero.arrayBuffer()),
            capacity: (activity.capacity as number),
            threshold: (activity.threshold as number),
            minage: activity.minage,
            location: await vertaal(activity.location),
            type: (activity.type),
            targetAudience: activity.targetAudience,
        })
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
    await db.update(activitiesTable).set({
        title: await vertaal(activity.title),
        subtitle: await vertaal(activity.subtitle),
        description: await vertaal(activity.description),
        price: (activity.price as number),
        hero: (activity.hero ? Buffer.from(await activity.hero.arrayBuffer()) : undefined),
        capacity: (activity.capacity as number),
        threshold: (activity.threshold as number),
        minage: activity.minage,
        location: await vertaal(activity.location),
        type: activity.type,
        targetAudience: activity.targetAudience,
    }).where(eq(activitiesTable.id, +id));
}

export async function getActivity(id: string) {
    return ((await db.select().from(activitiesTable).where(eq(activitiesTable.id, +id))))[0];
}