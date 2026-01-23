import {InsertSlideRequestBody, slideshowTable, UpdateSlideRequestBody} from './model';
import db from "../config/db";
import {DrizzleQueryError, eq} from 'drizzle-orm';
import {Static, status} from "elysia";
import * as fs from "node:fs";


export async function getSlides() {
    return db.select().from(slideshowTable);
}

export async function insertSlide(slide: Static<typeof InsertSlideRequestBody>) {
    if (slide.alt == "") {
        return status(400, {
            error: 'Alt-text is verplicht!!!'})
    }
    try {
        const imageBuffer = Buffer.from(await slide.image.arrayBuffer());

        const insertedSlideEntry = await db.insert(slideshowTable).values({
            alt: slide.alt,
        }).returning();

        fs.mkdirSync('public/slides', { recursive: true });
        fs.writeFileSync(`public/slides/${insertedSlideEntry[0].id}.png`, imageBuffer);
    } catch (e) {
        console.trace(e);
        if (e instanceof DrizzleQueryError) {
            if (e.cause?.message.includes('UNIQUE constraint failed')) return status(409, "Een slide met dit plaatje bestaat al.")
        }
    }
}

export async function updateSlide(id: string, slide: Static<typeof UpdateSlideRequestBody>) {
    await db.update(slideshowTable).set({
        alt: slide.alt,
    }).where(eq(slideshowTable.id, +id));
}

export async function getSlide(id: string) {
    const result = ((await db.select().from(slideshowTable).where(eq(slideshowTable.id, +id))))[0];
    if (!result) {
        throw new Error("Slide not found");
    }
    return result;
}