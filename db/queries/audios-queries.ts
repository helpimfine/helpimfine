"use server";

import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { InsertAudio, SelectAudio, audiosTable } from "../schema/audios-schema";

export const createAudio = async (data: InsertAudio) => {
  try {
    const [newAudio] = await db.insert(audiosTable).values(data).returning();
    return newAudio;
  } catch (error) {
    console.error("Error creating audio:", error);
    throw new Error("Failed to create audio");
  }
};

export const getAudios = async (): Promise<SelectAudio[]> => {
  try {
    return db.query.audios.findMany();
  } catch (error) {
    console.error("Error getting audios:", error);
    throw new Error("Failed to get audios");
  }
};

export const getAudio = async (id: string) => {
  try {
    const audio = await db.query.audios.findFirst({
      where: eq(audiosTable.id, id)
    });
    if (!audio) {
      throw new Error("Audio not found");
    }
    return audio;
  } catch (error) {
    console.error("Error getting audio by ID:", error);
    throw new Error("Failed to get audio");
  }
};

export const updateAudio = async (id: string, data: Partial<InsertAudio>) => {
  try {
    const [updatedAudio] = await db.update(audiosTable).set(data).where(eq(audiosTable.id, id)).returning();
    return updatedAudio;
  } catch (error) {
    console.error("Error updating audio:", error);
    throw new Error("Failed to update audio");
  }
};

export const deleteAudio = async (id: string) => {
  try {
    await db.delete(audiosTable).where(eq(audiosTable.id, id));
  } catch (error) {
    console.error("Error deleting audio:", error);
    throw new Error("Failed to delete audio");
  }
};