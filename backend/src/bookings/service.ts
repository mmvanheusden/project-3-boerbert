import {
    bookingsTable,
    InsertBookingRequest
} from './model';
import db from "../config/db";
import {Static, status} from "elysia";
import {DrizzleQueryError, eq} from "drizzle-orm";
import {slotsTable} from "../slots/model";
import {activitiesTable} from "../activities/model";


export async function insertBooking(request: Static<typeof InsertBookingRequest>) {
    // Check of het slot wel bestaat
    const slot = await db.select().from(slotsTable).where(eq(slotsTable.id, request.slotId)).get();
    if (!slot) { // Geen slot met dit id, dus een ongeldig request
        return status(404, "Er is geen slot met dit id.")
    }

    // Check of de activiteit voor dit slot wel bestaat
    const activity = await db.select().from(activitiesTable).where(eq(activitiesTable.id, slot.activityId)).get();
    if (!activity) {
        return status(400, "Er is geen activiteit met dit slot.")
    }

    // Tel de hoeveelheid bestaande boekingen voor dit slot
    let bookingsAmount = await db.$count(bookingsTable, eq(bookingsTable.slotId, request.slotId));
    if (bookingsAmount >= activity.capacity) { // Slot is op of over (illegaal) de capaciteit
        return status(409, "Dit slot is volgeboekt.")
    }

    try {
        await db.insert(bookingsTable).values({
            activityId: slot.activityId,
            slotId: request.slotId,
            amount: request.amount,
            campingSpot: request.campingSpot,
            paid: 1
        })
    } catch (e) {
        if (e instanceof DrizzleQueryError) {
            console.log(e.cause?.message)
            return status(500, "Er is iets misgegaan!")
        }
    }
}

export async function getActivityBookings(activityId: string) {
    return ((await db.select().from(bookingsTable).where(eq(bookingsTable.activityId, +activityId))));
}

export async function getAllBookings() {
    return db.select().from(bookingsTable);
}

export async function deleteBooking(id: string) {
    return db.select().from(bookingsTable);
}