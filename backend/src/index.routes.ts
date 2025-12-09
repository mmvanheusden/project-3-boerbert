import Elysia from 'elysia';
import {ActivitiesController} from "./activities";
import { SlideshowController } from './slideshow';
import {SlotsController} from "./slots";


const routes = new Elysia()
    .use(ActivitiesController)
    .use(SlideshowController)
    .use(SlotsController)

export { routes as AppRoutes };