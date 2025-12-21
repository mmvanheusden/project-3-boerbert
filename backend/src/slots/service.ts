import {
    InsertActivitySlotRequest, slotsTable,
} from './model';
import db from "../config/db";
import {DrizzleQueryError, eq} from 'drizzle-orm';
import {Static, status} from "elysia";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";


export async function insertSlot(slot: Static<typeof InsertActivitySlotRequest>) {
    dayjs.extend(customParseFormat)
    dayjs.extend(relativeTime)

    // Probeer de ontvangen datum en begintijd te parsen naar een dayjs object. Als dit niet lukt, weten we dat de client ongeldige data heeft gestuurd en keur dit request dan af.
    if (!dayjs(slot.date, 'YYYY-MM-DD', true).isValid()) {
        return status(400, "Datum ongeldig.")
    }

    if (!dayjs(slot.startTime, 'HH:mm', true).isValid()) {
        return status(400, "Starttijd ongeldig.")
    }

    // Check of de startdatum in de toekomst ligt
    if (!dayjs(`${slot.date} ${slot.startTime}`, 'YYYY-MM-DD HH:mm', true).isAfter(dayjs())) {
        return status(409, "De datum en tijd van het tijdslot liggen niet in de toekomst.")
    }

    try {
        await db.insert(slotsTable).values({
            activityId: slot.activityId,
            date: slot.date,
            startTime: slot.startTime,
            duration: slot.duration,
        })
    } catch (e) {
        if (e instanceof DrizzleQueryError) {
            if (e.cause?.message.includes('FOREIGN KEY constraint failed')) return status(404, "Activiteit bestaat niet.")

            console.log(e.cause?.message)
            return status(500, "Er is iets misgegaan!")
        }
    }
}

export async function getSlots(activityId: string) {
    return ((await db.select().from(slotsTable).where(eq(slotsTable.activityId, +activityId))));
}

export async function getAllSlots() {
    return db.select().from(slotsTable);
}

export async function deleteSlot(id: string) {
    return db.select().from(slotsTable);
}