import {Elysia} from "elysia";
import {getActivities, getActivity, insertActivity, updateActivity} from "./service";
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
            const activity = (await getActivity(id))[0];

            return {
                ...activity,
                hero: Buffer.from(activity.hero).toString('base64')
            }
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
    .patch(
        "/:id",
        async ({ params: { id}, body }) => {
            await updateActivity(id, body)
        }, {
            body: InsertActivityRequestBody,
            type: "multipart/form-data",
        }
    )
)
