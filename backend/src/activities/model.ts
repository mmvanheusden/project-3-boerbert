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
    minage: text({ enum: ["0", "3", "7", "12"] }).notNull(),
    location: text({ mode: 'json' }).$type<{ nl: string, en: string, de: string }>().notNull(),
	type: text({ enum: ["Sport/Spel", "Educatief", "Eten", "Overig"] }).notNull()
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
    minage: t.UnionEnum(["0", "3", "7", "12"]),
    location: t.String(),
	type: t.UnionEnum(["Sport/Spel", "Educatief", "Eten", "Overig"]),
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
	minage: t.UnionEnum(["0", "3", "7", "12"]),
	location: t.String(),
	type: t.UnionEnum(["Sport/Spel", "Educatief", "Eten", "Overig"]),
})

export const GetActivitiesResponseBody = t.Array(t.Object({
	id: t.Numeric(),
	title: t.Object({
		nl: t.String(),
		en: t.String(),
		de: t.String()
	}),
	subtitle: t.Object({
		nl: t.String(),
		en: t.String(),
		de: t.String()
	}),
	description: t.Object({
		nl: t.String(),
		en: t.String(),
		de: t.String()
	}),
	price: t.Numeric(),
	hero: t.String(), // Plaatje als base64, zodat 'ie makkelijk verstuurbaar is.
	capacity: t.Numeric(),
	threshold: t.Numeric(),
	minage: t.UnionEnum(["0", "3", "7", "12"]),
	location: t.Object({
		nl: t.String(),
		en: t.String(),
		de: t.String()
	}),
	slots: t.Array(t.Object({
		id: t.Numeric(),
		date: t.Date(),
		duration: t.Numeric(),
		bookings: t.Numeric(),
	})),
	type: t.UnionEnum(["Sport/Spel", "Educatief", "Eten", "Overig"]),
}))


// Source:  https://www.perplexity.ai/search/typescript-copy-object-type-bu-SVjn90luRVWbGLf8rRYdkg#2
// Override a field to hold a something else
export type OverrideField<Type, Key extends keyof Type, NewType> = {
    [K in keyof Type]: K extends Key ? NewType : Type[K];
};