"use server";

import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { InsertArt, SelectArt, artworksTable } from "../schema/artworks-schema";


export const createArtwork = async (data: InsertArt) => {
  try {
    const [newArtwork] = await db.insert(artworksTable).values(data).returning();
    return newArtwork;
  } catch (error) {
    console.error("Error creating artwork:", error);
    throw new Error("Failed to create artwork");
  }
};

export const getArtworks = async (userId: string, published?: boolean): Promise<SelectArt[]> => {
  try {
    let query;

    if (published !== undefined) {
      query = db.query.artworks.findMany({
        where: (artworks, { and }) => and(
          eq(artworks.userId, userId),
          eq(artworks.published, published)
        )
      });
    } else {
      query = db.query.artworks.findMany({
        where: eq(artworksTable.userId, userId)
      });
    }

    return query.execute();
  } catch (error) {
    console.error("Error getting artworks:", error);
    throw error;
  }
};

export const getArtwork = async (id: string) => {
  try {
    const artwork = await db.query.artworks.findFirst({
      where: eq(artworksTable.id, id)
    });
    if (!artwork) {
      throw new Error("Artwork not found");
    }
    return artwork;
  } catch (error) {
    console.error("Error getting artwork by ID:", error);
    throw new Error("Failed to get artwork");
  }
};

export const updateArtwork = async (id: string, data: Partial<InsertArt>) => {
  try {
    const [updatedArtwork] = await db.update(artworksTable).set(data).where(eq(artworksTable.id, id)).returning();
    return updatedArtwork;
  } catch (error) {
    console.error("Error updating artwork:", error);
    throw new Error("Failed to update artwork");
  }
};

export const deleteArtwork = async (id: string) => {
  try {
    await db.delete(artworksTable).where(eq(artworksTable.id, id));
  } catch (error) {
    console.error("Error deleting artwork:", error);
    throw new Error("Failed to delete artwork");
  }
};
