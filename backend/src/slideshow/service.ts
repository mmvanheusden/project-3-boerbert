import {
    InsertSlideRequestBody,
    slideshowTable, UpdateSlideRequestBody,
} from './model';
import db from "../config/db";
import {DrizzleQueryError, eq} from 'drizzle-orm';
import {Static, status} from "elysia";


export async function getSlides() {
    return db.select().from(slideshowTable);
}

export async function insertSlide(slide: Static<typeof InsertSlideRequestBody>) {
    if (slide.alt == "") {
        return status(400, {
            error: 'Alt-text is verplicht!!!'})
    }
    try {
        await db.insert(slideshowTable).values({
            image: Buffer.from(await slide.image.arrayBuffer()),
            alt: slide.alt,
        })
    } catch (e) {
        if (e instanceof DrizzleQueryError) {
            if (e.cause?.message.includes('UNIQUE constraint failed')) return status(409, "Een slide met dit plaatje bestaat al.")
        }
    }
}

export async function updateSlide(id: string, slide: Static<typeof UpdateSlideRequestBody>) {
    await db.update(slideshowTable).set({
        image: (slide.image ? Buffer.from(await slide.image.arrayBuffer()) : undefined),
        alt: slide.alt,
    }).where(eq(slideshowTable.id, +id));
}

export async function getSlide(id: string) {
    return ((await db.select().from(slideshowTable).where(eq(slideshowTable.id, +id))))[0];
}