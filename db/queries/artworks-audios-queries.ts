"use server";

import { db } from "@/db/db";
import { and, eq } from "drizzle-orm";
import { InsertArtAudioLink, SelectArtAudioLink, artworksAudiosTable } from "../schema/artworks-audios-schema";

export const createArtworkAudioLink = async (data: InsertArtAudioLink) => {
  try {
    const [newLink] = await db.insert(artworksAudiosTable).values(data).returning();
    return newLink;
  } catch (error) {
    console.error("Error creating artwork-audio link:", error);
    throw new Error("Failed to create artwork-audio link");
  }
};

export const getArtworkAudioLinks = async (): Promise<SelectArtAudioLink[]> => {
  try {
    return db.query.artworksAudios.findMany();
  } catch (error) {
    console.error("Error getting artwork-audio links:", error);
    throw new Error("Failed to get artwork-audio links");
  }
};

export const getArtworkAudioLink = async (artId: string, audioId: string) => {
  try {
    const link = await db.query.artworksAudios.findFirst({
      where: and(
        eq(artworksAudiosTable.artId, artId),
        eq(artworksAudiosTable.audioId, audioId)
      )
    });
    if (!link) {
      throw new Error("Artwork-audio link not found");
    }
    return link;
  } catch (error) {
    console.error("Error getting artwork-audio link:", error);
    throw new Error("Failed to get artwork-audio link");
  }
};

export const deleteArtworkAudioLink = async (artId: string, audioId: string) => {
  try {
    await db.delete(artworksAudiosTable).where(
      and(
        eq(artworksAudiosTable.artId, artId),
        eq(artworksAudiosTable.audioId, audioId)
      )
    );
  } catch (error) {
    console.error("Error deleting artwork-audio link:", error);
    throw new Error("Failed to delete artwork-audio link");
  }
};