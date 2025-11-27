import {blob, int, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {t} from "elysia";

export const activitiesTable = sqliteTable("activities", {
    id: int().primaryKey({autoIncrement: true}),
    title: text().notNull().unique(),
    subtitle: text().notNull(),
    description: text().notNull(),
    price: int().notNull(),
    hero: blob({ mode: 'buffer' }).notNull(), // Cover image
    capacity: int().notNull(),
    threshold: int().notNull(),
});


export const InsertActivityRequestBody = t.Object({
    title: t.String(),
    subtitle: t.String(),
    description: t.String(),
    price: t.Union([
        t.Number(),
        t.String(),
    ]),
    hero: t.File({
        type: "image/*"
    }),
    capacity: t.Union([
        t.Number(),
        t.String(),
    ]),
    threshold: t.Union([
        t.Number(),
        t.String(),
    ]),
})


// Source:  https://www.perplexity.ai/search/typescript-copy-object-type-bu-SVjn90luRVWbGLf8rRYdkg#2
// Override a field to hold a something else
export type OverrideField<Type, Key extends keyof Type, NewType> = {
    [K in keyof Type]: K extends Key ? NewType : Type[K];
};