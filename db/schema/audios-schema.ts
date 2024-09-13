import { pgEnum, pgTable, text, boolean, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
import { profilesTable } from "./profiles-schema";
import { collectionsTable } from "./collections-schema";

export const audiosTypeEnum = pgEnum("audios_type", ["mix", "Playlist"]);

export const audiosTable = pgTable("audios", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title").unique().notNull(),
  type: audiosTypeEnum("audios_type").notNull(),
  description: text("description"),
  tags: text("tags").array(),
  published: boolean("published").default(false).notNull(),
  userId: text("user_id").references(() => profilesTable.userId).notNull(),
  collectionId: uuid("collection_id").references(() => collectionsTable.id),
  created: timestamp("created").defaultNow().notNull(),
  audioUrl: varchar("audio_url"),
  imageUrl: varchar("image_url"),
  updatedAt: timestamp("updated_at")
  .defaultNow()
  .notNull()
  .$onUpdate(() => new Date())
});

export type InsertAudio = typeof audiosTable.$inferInsert;
export type SelectAudio = typeof audiosTable.$inferSelect;