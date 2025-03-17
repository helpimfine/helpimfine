"use server";

import { db } from "@/db/db";
import { eq, and, or, like, SQL, sql } from "drizzle-orm";
import { SelectArt, artworksTable, InsertArt } from "../schema/artworks-schema";
import { cache } from 'react';
import { asc, desc } from 'drizzle-orm';

const SORTABLE_COLUMNS = [
  'id', 'title', 'type', 'description', 'imageUrl', 'accessibilityDescription',
  'published', 'created', 'updatedAt'
] as const;

type SortableColumns = typeof SORTABLE_COLUMNS[number];

type GetArtworksParams = {
  page: number;
  pageSize: number;
  query: string;
  type: "all" | "human" | "ai";
  published: "all" | "published" | "unpublished";
  sortOrder: 'asc' | 'desc';
  sortBy: SortableColumns;
  isAuthenticated: boolean;
};

export const getArtworks = cache(async ({
  page,
  pageSize,
  query,
  type,
  published,
  sortOrder,
  sortBy,
  isAuthenticated
}: GetArtworksParams) => {
  let whereConditions: SQL[] = [];

  if (query) {
    whereConditions.push(
      or(
        like(artworksTable.title, `%${query}%`),
        like(artworksTable.accessibilityDescription, `%${query}%`),
        sql`${artworksTable.tags} @> ARRAY[${query}]::text[]` // This checks if the tags array contains the query
      ) as SQL
    );
  }

  if (type !== "all") {
    whereConditions.push(eq(artworksTable.type, type));
  }

  if (!isAuthenticated || published === "published") {
    whereConditions.push(eq(artworksTable.published, true));
  } else if (published === "unpublished") {
    whereConditions.push(eq(artworksTable.published, false));
  }

  const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(artworksTable)
    .where(whereClause);

  const total = Number(count);

  const orderByClause = sql`${artworksTable[sortBy]} ${sql.raw(sortOrder.toUpperCase())}`;

  const data = await db
    .select()
    .from(artworksTable)
    .where(whereClause)
    .orderBy(orderByClause)
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return { data, total };
});

// Cache the getArtwork query (by id)
export const getArtwork = cache(async (id: string) => {
  const artwork = await db.query.artworks.findFirst({
    where: eq(artworksTable.id, id)
  }).execute();

  if (!artwork) {
    throw new Error("Artwork not found");
  }
  return artwork;
});

// New function: getArtworkBySlug queries artwork by a slug derived from its title
export const getArtworkBySlug = cache(async (slug: string) => {
  const artwork = await db.query.artworks.findFirst({
    where: sql`${sql.raw("LOWER(REPLACE(")}${artworksTable.title}${sql.raw(",' ','-'))")} = ${slug}`
  }).execute();
  if (!artwork) {
    throw new Error("Artwork not found");
  }
  return artwork;
});

export const createArtwork = async (data: InsertArt): Promise<SelectArt> => {
  try {
    const [newArtwork] = await db.insert(artworksTable).values(data).returning();
    return newArtwork;
  } catch (error) {
    console.error("Error creating artwork:", error);
    throw new Error("Failed to create artwork");
  }
};

export const updateArtwork = async (id: string, data: Partial<InsertArt>): Promise<SelectArt> => {
  try {
    const [updatedArtwork] = await db.update(artworksTable).set(data).where(eq(artworksTable.id, id)).returning();
    return updatedArtwork;
  } catch (error) {
    console.error("Error updating artwork:", error);
    throw new Error("Failed to update artwork");
  }
};

export const deleteArtwork = async (id: string): Promise<void> => {
  try {
    await db.delete(artworksTable).where(eq(artworksTable.id, id));
  } catch (error) {
    console.error("Error deleting artwork:", error);
    throw new Error("Failed to delete artwork");
  }
};