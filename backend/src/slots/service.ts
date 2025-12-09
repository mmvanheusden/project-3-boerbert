import {
    InsertActivitySlotRequest, slotsTable,
} from './model';
import db from "../config/db";
import {DrizzleQueryError, eq} from 'drizzle-orm';
import {Static, status} from "elysia";


export async function insertSlot(slot: Static<typeof InsertActivitySlotRequest>) {
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
            return status(500, "Er is iets misgegaan!: ")
        }
    }
}

export async function getSlots(activityId: string) {
    return ((await db.select().from(slotsTable).where(eq(slotsTable.activityId, +activityId))));
}