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
    // Valideer of we wel minstens 1 plek willen boeken
    if (request.amount < 1) {
        return status(400, "Je moet minstens 1 plek boeken.")
    }

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

    // Tel de hoeveelheid bestaande boekingen (met amounts) voor dit slot
    let bookingsAmount = (await db.select().from(bookingsTable).where(eq(bookingsTable.slotId, request.slotId)).all()).reduce((accumulator, booking) => {return accumulator += booking.amount},0);
    if (bookingsAmount >= activity.capacity) { // Slot is op of over capaciteit
        return status(409, "Dit slot is volgeboekt.")
    } else if (bookingsAmount + request.amount > activity.capacity) { // Slot zou over de capaciteit heen gaan met deze boeking
        return status(409, `Er zijn nog maar ${activity.capacity - bookingsAmount} plekken vrij voor dit slot, je probeert er ${request.amount} te boeken.`)
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