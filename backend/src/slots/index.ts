import {Elysia} from "elysia";
import {InsertActivitySlotRequest} from "./model";
import {getSlots, insertSlot} from "./service";

export const SlotsController = new Elysia().group("/slots", (app) => app
    .put(
        "/",
        async (context) => {
            return await insertSlot(context.body)
        }, {
            body: InsertActivitySlotRequest,
            parse: "multipart/form-data",
        }
    )
    .get(
        '/:id',
        async ({params: {id}}) => {
            return await getSlots(id)
        }
    )
)
