import { pgTable, integer, text, boolean, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
import { profilesTable } from "./profiles-schema";
import { collectionsTable } from "./collections-schema";

export const articlesTable = pgTable("articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title").unique().notNull(),
  content: text("content").notNull(),
  published: boolean("published").default(false).notNull(),
  userId: text("user_id").references(() => profilesTable.userId).notNull(),
  collectionId: uuid("collection_id").references(() => collectionsTable.id),
  created: timestamp("created").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
  .defaultNow()
  .notNull()
  .$onUpdate(() => new Date()),
  imageUrl: varchar("image_url"),
});

export type InsertArticle = typeof articlesTable.$inferInsert;
export type SelectArticle = typeof articlesTable.$inferSelect;