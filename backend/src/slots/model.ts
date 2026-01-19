import {AnySQLiteColumn, int, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {activitiesTable} from "../activities/model";
import {t} from "elysia";

export const slotsTable = sqliteTable("slots", {
    id: int().primaryKey({autoIncrement: true}),
    activityId: int().references((): AnySQLiteColumn => activitiesTable.id).notNull(),
    date: text().notNull(),
    duration: int().notNull(),
});

export const InsertActivitySlotRequest = t.Object({
    activityId: t.Numeric(),
    date: t.String(),
    duration: t.Numeric(),
})

export const RepeatActivitySlotRequest = t.Object({
    interval: t.UnionEnum(["daily", "weekly", "monthly"]),
    times: t.Numeric(),
})