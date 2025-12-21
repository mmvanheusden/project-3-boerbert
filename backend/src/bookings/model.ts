import {AnySQLiteColumn, int, sqliteTable} from "drizzle-orm/sqlite-core";
import {activitiesTable} from "../activities/model";
import {t} from "elysia";
import {slotsTable} from "../slots/model";

export const bookingsTable = sqliteTable("bookings", {
    id: int().primaryKey({autoIncrement: true}),
    activityId: int().references((): AnySQLiteColumn => activitiesTable.id).notNull(),
    slotId: int().references((): AnySQLiteColumn => slotsTable.id).notNull(),
    amount: int().notNull(),
    paid: int().notNull(),
    campingSpot: int().notNull(),
});

export const InsertBookingRequest = t.Object({
    slotId: t.Numeric(),
    amount: t.Numeric(),
    campingSpot: t.Numeric(),
})