import {Elysia} from "elysia";
import {InsertActivitySlotRequest} from "./model";
import {getAllSlots, getSlots, insertSlot} from "./service";

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
            return await getSlots(id)
        }
    )
    .get(
        '/',
        async () => {
            return await getAllSlots()
        }
    )
)
