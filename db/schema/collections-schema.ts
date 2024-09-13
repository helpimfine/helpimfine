import { pgTable, integer, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

export const collectionsTable = pgTable("collections", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  title: varchar("title").notNull(),
  created: timestamp("created").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
  .defaultNow()
  .notNull()
  .$onUpdate(() => new Date())
});

export type InsertCollection = typeof collectionsTable.$inferInsert;
export type SelectCollection = typeof collectionsTable.$inferSelect;