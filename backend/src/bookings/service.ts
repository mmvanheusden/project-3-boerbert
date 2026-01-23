import {
    bookingsTable,
    InsertBookingRequest
} from './model';
import db from "../config/db";
import {Static, status} from "elysia";
import { and, DrizzleQueryError, eq, InferSelectModel, isNotNull } from "drizzle-orm";
import {slotsTable} from "../slots/model";
import {activitiesTable} from "../activities/model";
import dayjs from "dayjs";
import "dayjs/locale/nl"
import duration from "dayjs/plugin/duration";
import { EmailTransporter } from "../index";
import {composeBookingConfirmationEmail, composeBookingReminderEmail} from "../email";


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
        const [booking] =  await db.insert(bookingsTable).values({
            activityId: slot.activityId,
            slotId: request.slotId,
            amount: request.amount,
            campingSpot: request.campingSpot,
            paid: true,
            email: request.email,
            reminderEmailSent: false,
        }).returning();

        // Send confirmation email :O
        if (request.email) {
            await sendConfirmationEmail(booking, request.email);
        }
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

export async function sendConfirmationEmail(booking: InferSelectModel<typeof bookingsTable>, to: string) {
    if (!process.env.MAILTRAP_TOKEN!) {
        console.warn("GEEN MAILTRAP TOKEN GECONFIGUEERD, GEEN BEVESTIGINGS EMAIL VERSTUURD!")
        return;
    }

    // Met deze query halen we in 1x de slot op, en activiteit.
    const bookingData = await db.select().from(slotsTable).where(eq(slotsTable.id, booking.slotId)).leftJoin(activitiesTable, eq(activitiesTable.id, slotsTable.activityId)).get();
    if (!bookingData || !bookingData!.activities || !bookingData!.slots) {
        console.error("vereiste informatie van boeking niet gevonden, geen email verstuurd.")
        return;
    }

    const {subject, content} = composeBookingConfirmationEmail(booking, bookingData.activities, bookingData.slots);

    await EmailTransporter
        .sendMail({
            to: to,
            subject: subject,
            html: content
        });
}

export async function sendReminderEmails() {
    if (!process.env.MAILTRAP_TOKEN!) {
        console.warn("GEEN MAILTRAP TOKEN GECONFIGUEERD, GEEN REMINDER EMAIL VERSTUURD!")
        return;
    }
    dayjs.extend(duration)

    // Met deze query halen we in 1x de boeking op, slot, en activiteit.
    const notRemindedBookings = await db.select().from(bookingsTable).where(and(eq(bookingsTable.reminderEmailSent, false), isNotNull(bookingsTable.email))).innerJoin(slotsTable, eq(slotsTable.id, bookingsTable.slotId)).innerJoin(activitiesTable, eq(activitiesTable.id, slotsTable.activityId)).all();

    for (const { activities: activity, bookings: booking, slots: slot } of notRemindedBookings) {
        if (dayjs.duration(dayjs(slot.date).diff(dayjs())).days() <= 1) {
            // Slot is morgen
            console.log(`Slot ${slot.id} is morgen, verstuur herinneringsemail naar ${booking.email} (Boeking ${booking.id})`)

            const {subject, content} = composeBookingReminderEmail(booking, activity, slot);

            // Stuur de email
            await EmailTransporter
                .sendMail({
                    to: booking.email!,
                    subject: subject,
                    html: content
                });

            await db.update(bookingsTable).set({reminderEmailSent: true}).where(eq(bookingsTable.id, booking.id));
        }
    }
}