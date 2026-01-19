import {
    InsertActivitySlotRequest, RepeatActivitySlotRequest, slotsTable,
} from './model';
import db from "../config/db";
import {DrizzleQueryError, eq, InferSelectModel} from 'drizzle-orm';
import {Static, status} from "elysia";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";


export async function insertSlot(slot: Static<typeof InsertActivitySlotRequest>) {
    dayjs.extend(customParseFormat)
    dayjs.extend(relativeTime)
    dayjs.extend(utc)

    // Probeer de ontvangen datum met begintijd te parsen naar een dayjs object. Als dit niet lukt, weten we dat de client ongeldige data heeft gestuurd en keur dit request dan af.
    if (!dayjs(slot.date, 'YYYY-MM-DDTHH:mm', true).isValid()) {
        return status(400, "Datum ongeldig.")
    }

    // Check of de startdatum in de toekomst ligt
    if (!dayjs(slot.date, 'YYYY-MM-DDTHH:mm', true).isAfter(dayjs())) {
        return status(409, "De datum en begintijd van het tijdslot liggen niet in de toekomst.")
    }

    try {
        await db.insert(slotsTable).values({
            activityId: slot.activityId,
            date: dayjs(slot.date, 'YYYY-MM-DDTHH:mm', true).utc().toISOString(),
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

export async function repeatSlot(slotId: number, request: Static<typeof RepeatActivitySlotRequest>) {
    if (request.times <= 0) {
        return status(400, "Je kan niet 0 of minder keer een slot herhalen!")

    }
    // Vind eerst het slot dat herhaald moet worden.
    const [slot] = await db.selectDistinct().from(slotsTable).where(eq(slotsTable.id, slotId));

    if (!slot) { // Slot is niet gevonden.
        return status(404, "Slot niet gevonden!")
    }

    // Herhaal het slot.
    await repeatSlotInDatabase(slot, RepeatInterval[request.interval.toUpperCase() as keyof typeof RepeatInterval] /* Hiermee halen we de enum waarde op op basis van de key van de enum.*/, request.times)
}


// Day.js eenheden (https://day.js.org/docs/en/manipulate/add) (zo geil)
enum RepeatInterval {
    DAILY = "day",
    WEEKLY = "week",
    MONTHLY = "month",
}

async function repeatSlotInDatabase(slot: InferSelectModel<typeof slotsTable>, interval: RepeatInterval, times: number) {
    dayjs.extend(utc)

    for (let i = 0; i < times; i++) {
        // Herhaal het slot
        try {
            await db.insert(slotsTable).values({
                activityId: slot.activityId,
                date: dayjs(slot.date).add(i+1, interval).utc().toISOString(),
                duration: slot.duration,
            })
        } catch (e) {
            console.trace(e)
            if (e instanceof DrizzleQueryError) {
                console.log(e.cause?.message)
            }
        }
    }
}