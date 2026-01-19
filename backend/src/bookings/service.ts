import {
    bookingsTable,
    InsertBookingRequest
} from './model';
import db from "../config/db";
import {Static, status} from "elysia";
import { and, DrizzleQueryError, eq, InferSelectModel, isNotNull } from "drizzle-orm";
import {slotsTable} from "../slots/model";
import {activitiesTable} from "../activities/model";
import * as fs from "node:fs";
import * as handlebars from "handlebars";
import dayjs from "dayjs";
import "dayjs/locale/nl"
import duration from "dayjs/plugin/duration";
import { EmailTransporter } from "../index";


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
            paid: 1,
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

    const activity = await db.select().from(activitiesTable).where(eq(activitiesTable.id, booking.activityId)).get();
    const slot = await db.select().from(slotsTable).where(eq(slotsTable.id, booking.slotId)).get();
    if (!activity || !slot) {
        console.error("vereiste informatie van boeking niet gevonden, geen email verstuurd.")
        return;
    }


    const contentTemplate = handlebars.compile(fs.readFileSync('emails/boekingsbevestiging/content.hbs', 'utf8'));
    const subjectTemplate =  handlebars.compile(fs.readFileSync('emails/boekingsbevestiging/subject.hbs', 'utf8'));

    const content = contentTemplate({
        activity_name: activity!.title.nl,
        slot_datetime: dayjs(slot.date).locale("nl").format("D[ ]MMMM[ om ]HH:mm"),
        activity_location: activity!.location.nl,
        activity_minage: activity!.minage == "0" ? "Alle leeftijden" : activity!.minage + "+",
        booking_amount: booking.amount,
        activity_price: `€ ${activity!.price.toFixed(2).dot2comma().replace(",00", ",-")}`
    });
    const subject = subjectTemplate({
        slot_date: dayjs(slot.date).locale("nl").format("D[ ]MMMM"),
    });


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
    const notRemindedBookings = await db.select().from(bookingsTable).where(and(eq(bookingsTable.reminderEmailSent, false), isNotNull(bookingsTable.email)));

    for (const booking of notRemindedBookings) {
        const [slot] = await db.selectDistinct().from(slotsTable).where(eq(slotsTable.id, booking.slotId));
        if (dayjs.duration(dayjs(slot.date).diff(dayjs())).days() <= 1) {
            // Slot is morgen
            console.log(`Slot ${slot.id} is morgen, verstuur herinneringsemail naar ${booking.email} (Boeking ${booking.id})`)

            // Stuur de email
            const activity = await db.select().from(activitiesTable).where(eq(activitiesTable.id, booking.activityId)).get();

            const contentTemplate = handlebars.compile(fs.readFileSync('emails/boekingsherinnering/content.hbs', 'utf8'));
            const subjectTemplate =  handlebars.compile(fs.readFileSync('emails/boekingsherinnering/subject.hbs', 'utf8'));

            const content = contentTemplate({
                activity_name: activity!.title.nl,
                slot_datetime: dayjs(slot.date).locale("nl").format("D[ ]MMMM[ om ]HH:mm"),
                activity_location: activity!.location.nl,
                activity_minage: activity!.minage == "0" ? "Alle leeftijden" : activity!.minage + "+",
                booking_amount: booking.amount,
                activity_price: `€ ${activity!.price.toFixed(2).dot2comma().replace(",00", ",-")}`
            });

            const subject = subjectTemplate({
                slot_date: dayjs(slot.date).locale("nl").format("D[ ]MMMM"),
            });


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