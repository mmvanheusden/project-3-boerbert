import {Elysia, Static} from "elysia";
import {getActivities, getActivity, insertActivity, updateActivity} from "./service";
import {activitiesTable, GetActivitiesResponseBody, InsertActivityRequestBody, UpdateActivityRequestBody} from "./model";
import {eq} from "drizzle-orm";
import db from "../config/db";
import {getAllSlots} from "../slots/service";

export const ActivitiesController = new Elysia().group("/activities", (app) => app
    .get(
        '/',
        async () => {
            // Before sending, we're base64 encoding the hero field so the requests are smaller.
            const activites = await getActivities();
            const modifiedActivities: Static<typeof GetActivitiesResponseBody> = [];
            const slots = await getAllSlots();
            activites.forEach((activity) => {
                modifiedActivities.push({
                    ...activity,
                    hero: Buffer.from(activity.hero).toString('base64'),
                    slots: slots.filter((slot) => slot.activityId == activity.id).map((slot) => ({
                        id: slot.id,
                        date: new Date(slot.date), // Zet de datum met begintijd om van een string naar een Date object. Dit zou nooit fout moeten gaan. (Anders valideren we inkomende data niet goed)
                        duration: slot.duration,
                    }))
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
