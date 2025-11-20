import {Elysia} from "elysia";
import {getActivities, getActivity} from "./service";

export const ActivitiesController = new Elysia().group("/activities", (app) => app
    .get(
        '/',
        async () => {
            return await getActivities()
        }
    )
    .get(
        '/:id',
        async ({params: {id}}) => {
            return await getActivity(id);
        }
    )
)
