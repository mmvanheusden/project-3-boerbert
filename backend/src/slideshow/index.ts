import {Elysia} from "elysia";

import {slideshowTable, InsertSlideRequestBody, UpdateSlideRequestBody} from "./model";
import {eq, InferSelectModel} from "drizzle-orm";
import db from "../config/db";
import {OverrideField} from "../activities/model";
import {getSlide, getSlides, insertSlide, updateSlide} from "./service";

export const SlideshowController = new Elysia().group("/slideshow", (app) => app
    .get(
        '/',
        async () => {
            // Before sending, we're base64 encoding the hero field so the requests are smaller.
            const slides = await getSlides();
            const encodedSlides: OverrideField<InferSelectModel<typeof slideshowTable>, 'image', string>[] = [];
            slides.forEach((slide) => {
                encodedSlides.push({
                    ...slide,
                    image: Buffer.from(slide.image).toString('base64')
                });
            })

            return encodedSlides
        }
    )
    .get(
        '/:id',
        async ({params: {id}}) => {
            const slide = await getSlide(id);

            return {
                ...slide,
                hero: Buffer.from(slide.image).toString('base64')
            }
        }
    )
    .put(
        "/",
        async (context) => {
            return await insertSlide(context.body)
        }, {
            body: InsertSlideRequestBody,
            parse: "multipart/form-data",
        }
    )
    .patch(
        "/:id",
        async ({ params: { id}, body }) => {
            await updateSlide(id, body)
        }, {
            body: UpdateSlideRequestBody,
            parse: "application/json",
        }
    )
    .delete(
        "/:id",
        async ({params: {id}}) => {
            await db.delete(slideshowTable).where(eq(slideshowTable.id, +id));
        }
    )
)
