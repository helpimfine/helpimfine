import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { artworksTable } from "./artworks-schema";
import { audiosTable } from "./audios-schema";

export const artworksAudiosTable = pgTable("artworks-audios", {
  artId: uuid("art_id").references(() => artworksTable.id).notNull(),
  audioId: uuid("audio_id").references(() => audiosTable.id).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.artId, table.audioId] }),
}));

export type InsertArtAudioLink = typeof artworksAudiosTable.$inferInsert;
export type SelectArtAudioLink = typeof artworksAudiosTable.$inferSelect;
