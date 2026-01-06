import {Elysia} from "elysia";
import {InsertActivitySlotRequest, slotsTable} from "./model";
import {getAllSlots, getSlots, insertSlot} from "./service";
import {eq} from 'drizzle-orm';
import db from "../config/db";


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
            return (await getAllSlots()).map((slot) => ({
                ...slot,
                date: new Date(slot.date)
            }));
        }
    )
    .delete(
        "/:id",
        async ({params: {id}}) => {
            await db.delete(slotsTable).where(eq(slotsTable.id, +id));
        }
    )
)
