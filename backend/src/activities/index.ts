import {Elysia} from "elysia";
import {getActivities, getActivity, insertActivity, updateActivity} from "./service";
import {activitiesTable, InsertActivityRequestBody, OverrideField, UpdateActivityRequestBody} from "./model";
import {eq, InferSelectModel} from "drizzle-orm";
import db from "../config/db";

export const ActivitiesController = new Elysia().group("/activities", (app) => app
    .get(
        '/',
        async () => {
            // Before sending, we're base64 encoding the hero field so the requests are smaller.
            const activites = await getActivities();
            const modifiedActivities: OverrideField<InferSelectModel<typeof activitiesTable>, 'hero', string>[] = [];
            activites.forEach((activity) => {
                modifiedActivities.push({
                    ...activity,
                    hero: Buffer.from(activity.hero).toString('base64')
                });
            })

            return modifiedActivities
        }
    )
    .get(
        '/:id',
        async ({params: {id}}) => {
            const activity = await getActivity(id);

            return {
                ...activity,
                hero: Buffer.from(activity.hero).toString('base64')
            }
        }
    )
    .put(
        "/",
        async (context) => {
            return await insertActivity(context.body)
        }, {
            body: InsertActivityRequestBody,
            parse: "multipart/form-data",
        }
    )
    .patch(
        "/:id",
        async ({ params: { id}, body }) => {
            await updateActivity(id, body)
        }, {
            body: UpdateActivityRequestBody,
            parse: "application/json",
        }
    )
    .delete(
        "/:id",
        async ({params: {id}}) => {
            await db.delete(activitiesTable).where(eq(activitiesTable.id, +id));
        }
    )
)
