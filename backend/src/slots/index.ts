import {Elysia} from "elysia";
import {InsertActivitySlotRequest, slotsTable} from "./model";
import {getAllSlots, getSlots, insertSlot} from "./service";
import {eq} from 'drizzle-orm';
import db from "../config/db";
import { getActivityBookings, getAllBookings } from "../bookings/service";
import {bookingsTable} from "../bookings/model";


export const SlotsController = new Elysia().group("/slots", (app) => app
    .put(
        "/",
        async (context) => {
            return await insertSlot(context.body)
        }, {
            body: InsertActivitySlotRequest,
            parse: "json",
        }
    )
    .get(
        '/:id',
        async ({params: {id}}) => {
            return (await getSlots(id)).map((slot) => ({
                ...slot,
                date: new Date(slot.date)
            }))
        }
    )
    .get(
        '/',
        async () => {
            return Promise.all((await getAllSlots()).map(async (slot) => ({
                ...slot,
                date: new Date(slot.date),
                bookings: (await getActivityBookings(slot.activityId.toString())).filter((booking) => booking.slotId == slot.id).reduce((accumulator, booking) => {
                    return accumulator += booking.amount
                }, 0), // Tel alle personen die in de boekingen staan op.
            })));
        }
    )
    .delete(
        "/:id",
        async ({params: {id}}) => {
            // Verwijder eerst de boekingen gekoppeld aan dit slot
            const bookings = (await getAllBookings()).filter(booking => booking.slotId == +id);
            for (const booking of bookings) {
                await db.delete(bookingsTable).where(eq(bookingsTable.id, booking.id));
            }

            // Verwijder daarna het slot zelf
            await db.delete(slotsTable).where(eq(slotsTable.id, +id));
        }
    )
)
