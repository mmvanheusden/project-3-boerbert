import {blob, int, sqliteTable, text} from "drizzle-orm/sqlite-core";

export const activitiesTable = sqliteTable("activities", {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull().unique(),
    subtitle: text().notNull(),
    description: text().notNull(),
    price: int().notNull(),
    hero: blob().notNull(),
    age: int().notNull(),
    email: text().notNull(),
});