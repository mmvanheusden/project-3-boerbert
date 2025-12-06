import Elysia from 'elysia';
import {ActivitiesController} from "./activities";
import { SlideshowController } from './slideshow';


const routes = new Elysia()
    .use(ActivitiesController)
    .use(SlideshowController);

export { routes as AppRoutes };