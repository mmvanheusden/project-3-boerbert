import Elysia from 'elysia';
import {ActivitiesController} from "./activities";


const routes = new Elysia()
    .use(ActivitiesController);

export { routes as AppRoutes };