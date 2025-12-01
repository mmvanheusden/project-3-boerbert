import {Elysia, file, status, Static} from "elysia";
import {getActivities, getActivity, insertActivity, updateActivity} from "./service";
import {activitiesTable, GetActivitiesResponseBody, InsertActivityRequestBody, OverrideField, UpdateActivityRequestBody} from "./model";
import {eq, InferSelectModel} from "drizzle-orm";
import db from "../config/db";
import {getAllSlots} from "../slots/service";
import {getActivityBookings} from "../bookings/service";
import {bookingsTable} from "../bookings/model";
import {slotsTable} from "../slots/model";
import * as fs from "node:fs";

export const ActivitiesController = new Elysia().group("/activities", (app) => app
    .get(
        '/',
        async () => {
            // Before sending, we're base64 encoding the hero field so the requests are smaller.
            const activites = await getActivities();
            const modifiedActivities: Static<typeof GetActivitiesResponseBody> = [];
            const slots = await getAllSlots();

            for (const activity of activites) {
                const activitySlots = await Promise.all(
                    slots.filter((slot) => slot.activityId == activity.id).map(async (slot) => {
                        const bookings = (
                            await getActivityBookings(activity.id.toString()))
                                  .filter((booking) => booking.slotId == slot.id); // Haal alle boekingen op voor deze activiteit, filter ze daarna op specifiek dit slot.

                        return {
                            id: slot.id,
                            date: new Date(slot.date), // Zet de datum met begintijd om van een string naar een Date object. Dit zou nooit fout moeten gaan. (Anders valideren we inkomende data niet goed)
                            duration: slot.duration,
                            bookings: bookings.reduce((accumulator, booking) => {return accumulator += booking.amount},0), // Tel alle personen die in de boekingen staan op.
                        };
                    }),
                );

                modifiedActivities.push({
                    ...activity,
                    slots: activitySlots,
                });
            }

            return modifiedActivities
        }
    )
    .get('/compact',
        async () => {
            const activites = await getActivities();
            // Only send the dutch fields
            const modifiedActivities: OverrideField<InferSelectModel<typeof activitiesTable>, 'title' | 'subtitle' | 'description' | 'location', string>[] = [];
            activites.forEach((activity) => {
                modifiedActivities.push({
                    ...activity,
                    title: activity!.title.nl,
                    subtitle: activity!.subtitle.nl,
                    description: activity.description.nl,
                    location: activity.location.nl,
                });
            })

            return modifiedActivities
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
            // Eerst alle boekingen van de activiteit verwijderen
            const bookings = await getActivityBookings(id);
            for (const booking of bookings) {
                await db.delete(bookingsTable).where(eq(bookingsTable.id, booking.id));
            }

            // Dan alle slots voor deze activiteit verwijderen
            await db.delete(slotsTable).where(eq(slotsTable.activityId, +id));

            // Nu zijn alle childs weg, en kunnen we de activiteit weggooien.
            await db.delete(activitiesTable).where(eq(activitiesTable.id, +id));
        }
    )
	.get(
		'/:id/image',
		async ({params: {id}}) => {
			let activity: InferSelectModel<typeof activitiesTable>;
			try {
				activity = await getActivity(id);
			} catch (error) {
				return status(404, "Activiteit niet gevonden");
			}
			if (!fs.existsSync(`public/${(activity as InferSelectModel<typeof activitiesTable>).id}.png`)) {
				return status(500, "Plaatje niet gevonden");
			}

			return file(`public/${(activity as InferSelectModel<typeof activitiesTable>).id}.png`);
		})
)
