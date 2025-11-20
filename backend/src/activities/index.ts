import {Elysia} from "elysia";
import {getActivities, getActivity, insertActivity} from "./service";
import {InsertActivityRequestBody} from "./model";

export const ActivitiesController = new Elysia().group("/activities", (app) => app
    .get(
        '/',
        async () => {
            return getActivities();
        }
    )
    .get(
        '/:id',
        async ({params: {id}}) => {
            return await getActivity(id);
        }
    )
    .put(
        "/",
        async (context) => {
            await insertActivity(context.body)
        }, {
            body: InsertActivityRequestBody,
            type: "multipart/form-data",
        }
    )
)
