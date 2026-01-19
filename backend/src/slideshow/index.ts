import {Elysia, file, status} from "elysia";
import {InsertSlideRequestBody, slideshowTable, UpdateSlideRequestBody} from "./model";
import {eq, InferSelectModel} from "drizzle-orm";
import db from "../config/db";
import {getSlide, getSlides, insertSlide, updateSlide} from "./service";
import * as fs from "node:fs";

export const SlideshowController = new Elysia().group("/slideshow", (app) => app
    .get(
        '/',
        async () => {
            // Before sending, we're base64 encoding the hero field so the requests are smaller.
            return getSlides();
        }
    )
    .get(
        '/:id',
        async ({params: {id}}) => {
            return await getSlide(id);
        }
    )
    .get(
        '/:id/image',
        async ({params: {id}}) => {
            let slide: InferSelectModel<typeof slideshowTable>;
            try {
                slide = await getSlide(id);
            } catch (error) {
                return status(404, "Slide niet gevonden");
            }
            if (!fs.existsSync(`public/slides/${slide.id}.png`)) {
                return status(500, "Plaatje niet gevonden");
            }

            return file(`public/slides/${slide.id}.png`);
        })
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
