import {blob, int, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {t} from "elysia";

export const slideshowTable = sqliteTable("slideshow", {
    id: int().primaryKey({autoIncrement: true}),
    image: blob({ mode: 'buffer' }).notNull().unique(),
    alt: text().notNull(),
});


export const InsertSlideRequestBody = t.Object({
    image: t.File({
        type: "image/*"
    }),
    alt: t.String(),
})

export const UpdateSlideRequestBody = t.Object({
    image: t.File({
        type: "image/*"
    }),
    alt: t.String(),
})