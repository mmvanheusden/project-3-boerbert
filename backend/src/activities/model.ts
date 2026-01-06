import {blob, int, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {t} from "elysia";

export const activitiesTable = sqliteTable("activities", {
    id: int().primaryKey({autoIncrement: true}),
    title: text({ mode: 'json' }).$type<{ nl: string, en: string, de: string }>().notNull().unique(),
    subtitle: text({ mode: 'json' }).$type<{ nl: string, en: string, de: string }>().notNull(),
    description: text({ mode: 'json' }).$type<{ nl: string, en: string, de: string }>().notNull(),
    price: int().notNull(),
    hero: blob({ mode: 'buffer' }).notNull(), // Cover image
    capacity: int().notNull(),
    threshold: int().notNull(),
    minage: int().notNull(),
    location: text({ mode: 'json' }).$type<{ nl: string, en: string, de: string }>().notNull(),
});


export const InsertActivityRequestBody = t.Object({
    title: t.String(),
    subtitle: t.String(),
    description: t.String(),
    hero: t.File({
        type: "image/*"
    }),
    price: t.Numeric(),
    capacity: t.Numeric(),
    threshold: t.Numeric(),
    minage: t.Numeric(),
    location: t.String(),
})

export const UpdateActivityRequestBody = t.Object({
	title: t.String(),
	subtitle: t.String(),
	description: t.String(),
	hero: t.Optional(
		t.File({
			type: "image/*"
		})
	),
	price: t.Numeric(),
	capacity: t.Numeric(),
	threshold: t.Numeric(),
	minage: t.Numeric(),
	location: t.String(),
})


// Source:  https://www.perplexity.ai/search/typescript-copy-object-type-bu-SVjn90luRVWbGLf8rRYdkg#2
// Override a field to hold a something else
export type OverrideField<Type, Key extends keyof Type, NewType> = {
    [K in keyof Type]: K extends Key ? NewType : Type[K];
};