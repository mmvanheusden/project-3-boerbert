import {Elysia} from "elysia";
import {InsertBookingRequest, bookingsTable} from "./model";
import {getActivityBookings, getAllBookings, insertBooking} from "./service";
import {eq} from 'drizzle-orm';
import db from "../config/db";


export const BookingsController = new Elysia().group("/bookings", (app) => app
    .put(
        "/",
        async (context) => {
            return await insertBooking(context.body)
        }, {
            body: InsertBookingRequest,
            parse: "json",
        }
    )
    .get(
        '/:id',
        async ({params: {id}}) => {
            return await getActivityBookings(id)
        }
    )
    .get(
        '/',
        async () => {
            return await getAllBookings()
        }
    )
    .delete(
        "/:id",
        async ({params: {id}}) => {
            await db.delete(bookingsTable).where(eq(bookingsTable.id, +id));
        }
    )
)
