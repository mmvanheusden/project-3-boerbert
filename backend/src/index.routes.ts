import Elysia from 'elysia';
import {ActivitiesController} from "./activities";
import {SlideshowController} from './slideshow';
import {SlotsController} from "./slots";
import {BookingsController} from "./bookings";


const routes = new Elysia()
    .use(ActivitiesController)
    .use(SlideshowController)
    .use(SlotsController)
    .use(BookingsController)

export { routes as AppRoutes };