import {Elysia, ElysiaCustomStatusResponse, file, status} from "elysia";
import {getActivities, getActivity, insertActivity, updateActivity} from "./service";
import {activitiesTable, InsertActivityRequestBody, OverrideField} from "./model";
import {eq, InferSelectModel} from "drizzle-orm";
import db from "../config/db";

/* Probeert de activiteit op te halen, en geeft een adequate error terug als dit misgaat. Ook wordt het plaatje naar een base64-string omgezet. */
async function getActivitySafe(id: string): Promise<ElysiaCustomStatusResponse<404, "Activiteit niet gevonden", 404> | ElysiaCustomStatusResponse<500, "Er ging iets mis bij het ophalen van de activiteit", 500> | {hero: string, id: number, title: string, subtitle: string, description: string, price: number, capacity: number, threshold: number}>
{
	try {
		let activity: InferSelectModel<typeof activitiesTable>;
		try {
			activity = await getActivity(id);
		} catch (error) {
			return status(404, "Activiteit niet gevonden");
		}

		if (!activity) {
			return status(404, "Activiteit niet gevonden");
		}

		return {
			...activity,
			hero: Buffer.from(activity.hero).toString('base64'),
		};
	} catch (error) {
		return status(500, "Er ging iets mis bij het ophalen van de activiteit");
	}
}

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
			return getActivitySafe(id)
		}
	)
    .put(
        "/",
        async (context) => {
            await insertActivity(context.body)
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
            body: InsertActivityRequestBody,
            parse: "multipart/form-data",
        }
    )
    .delete(
        "/:id",
        async ({params: {id}}) => {
            await db.delete(activitiesTable).where(eq(activitiesTable.id, +id));
        }
    )
	.get(
		'/image/:id',
		async ({params: {id}}) => {
			let activity: InferSelectModel<typeof activitiesTable>;
			try {
				activity = await getActivity(id);
			} catch (error) {
				return status(404, "Activiteit niet gevonden");
			}

			return file(`public/${(activity as InferSelectModel<typeof activitiesTable>).id}.png`);
		})
)
