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
    minage: int().notNull(),
    location: text().notNull(),
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

export const GetActivitiesResponseBody = t.Array(t.Object({
	id: t.Numeric(),
	title: t.String(),
	subtitle: t.String(),
	description: t.String(),
	price: t.Numeric(),
	hero: t.String(), // Plaatje als base64, zodat 'ie makkelijk verstuurbaar is.
	capacity: t.Numeric(),
	threshold: t.Numeric(),
	minage: t.Numeric(),
	location: t.String(),
	slots: t.Array(t.Object({
		id: t.Numeric(),
		date: t.Date(),
		duration: t.Numeric(),
		bookings: t.Numeric(),
	})),
}))


// Source:  https://www.perplexity.ai/search/typescript-copy-object-type-bu-SVjn90luRVWbGLf8rRYdkg#2
// Override a field to hold a something else
export type OverrideField<Type, Key extends keyof Type, NewType> = {
    [K in keyof Type]: K extends Key ? NewType : Type[K];
};