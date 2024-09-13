import { pgEnum, pgTable, integer, text, jsonb, boolean, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
import { profilesTable } from "./profiles-schema";
import { collectionsTable } from "./collections-schema";

export const artworksTypeEnum = pgEnum("artworks_type", ["human", "ai"]);

export const artworksTable = pgTable("artworks", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title").unique().notNull(),
  type: artworksTypeEnum("artworks_type").notNull(),
  description: text("description"),
  imageUrl: varchar("image_url"),
  accessibilityDescription: text("accessibility_description"),
  mainObjects: text("main_objects").array(),
  tags: text("tags").array(),
  emotions: text("emotions").array(),
  review: jsonb("review"),
  colours: jsonb("colours"),
  published: boolean("published").default(false).notNull(),
  parentId: uuid("parent_id").references((): any => artworksTable.id),
  userId: text("user_id").references(() => profilesTable.userId).notNull(),
  collectionId: uuid("collection_id").references(() => collectionsTable.id),
  created: timestamp("created").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertArt = typeof artworksTable.$inferInsert;
export type SelectArt = typeof artworksTable.$inferSelect;