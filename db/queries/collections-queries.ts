"use server";

import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { InsertCollection, SelectCollection, collectionsTable } from "../schema/collections-schema";

export const createCollection = async (data: InsertCollection) => {
  try {
    const [newCollection] = await db.insert(collectionsTable).values(data).returning();
    return newCollection;
  } catch (error) {
    console.error("Error creating collection:", error);
    throw new Error("Failed to create collection");
  }
};

export const getCollections = async (): Promise<SelectCollection[]> => {
  try {
    return db.query.collections.findMany();
  } catch (error) {
    console.error("Error getting collections:", error);
    throw new Error("Failed to get collections");
  }
};

export const getCollection = async (id: string) => {
  try {
    const collection = await db.query.collections.findFirst({
      where: eq(collectionsTable.id, id)
    });
    if (!collection) {
      throw new Error("Collection not found");
    }
    return collection;
  } catch (error) {
    console.error("Error getting collection by ID:", error);
    throw new Error("Failed to get collection");
  }
};

export const updateCollection = async (id: string, data: Partial<InsertCollection>) => {
  try {
    const [updatedCollection] = await db.update(collectionsTable).set(data).where(eq(collectionsTable.id, id)).returning();
    return updatedCollection;
  } catch (error) {
    console.error("Error updating collection:", error);
    throw new Error("Failed to update collection");
  }
};

export const deleteCollection = async (id: string) => {
  try {
    await db.delete(collectionsTable).where(eq(collectionsTable.id, id));
  } catch (error) {
    console.error("Error deleting collection:", error);
    throw new Error("Failed to delete collection");
  }
};