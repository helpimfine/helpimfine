"use server";

import { createArtwork, getArtwork, updateArtwork, deleteArtwork, getArtworks } from "@/db/queries/artwork-queries";
import { InsertArt, SelectArt, artworksTable } from "@/db/schema/artworks-schema";
import { revalidatePath } from "next/cache";
import { createClient } from '@/utils/supabase/server';
import { db } from "@/db/db";
import { eq, and, or, like, sql, SQL, ne, asc, desc } from "drizzle-orm";
import { PaginationResult } from "@/types/actions/action-types";

export async function createArtworkAction(artwork: InsertArt): Promise<SelectArt> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user found");
    }

    artwork.userId = user.id;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ user_id: user.id });

      if (insertError) {
        throw new Error(`Failed to create profile: ${insertError.message}`);
      }
    }

    const result = await createArtwork(artwork);
    return result;
  } catch (error) {
    console.error('Error creating artwork:', error);
    throw error;
  }
}

export async function getArtworksAction(
  searchParams: {
    query?: string;
    page?: string;
    pageSize?: string;
    type?: string;
    published?: string;
    sortOrder?: 'asc' | 'desc';
    sortBy?: 'created' | 'title';
  },
  editMode: boolean
): Promise<PaginationResult<SelectArt>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const page = Number(searchParams.page) || 1;
    const pageSize = Number(searchParams.pageSize) || 12;
    const search = searchParams.query || "";
    const typeFilter = (searchParams.type as "all" | "human" | "ai") || "all";
    const publishedFilter = (searchParams.published as "all" | "published" | "unpublished") || "all";
    const sortOrder = searchParams.sortOrder || 'desc';
    const sortBy = searchParams.sortBy || 'created';

    const isAuthenticated = !!user;

    const { data, total } = await getArtworks({
      page,
      pageSize,
      query: search,
      type: typeFilter,
      published: publishedFilter,
      sortOrder,
      sortBy,
      isAuthenticated
    });

    const totalPages = Math.ceil(total / pageSize);
    const safePageNumber = Math.min(Math.max(1, page), totalPages);

    return {
      data,
      total,
      page: safePageNumber,
      pageSize,
      status: 'success'
    };
  } catch (error) {
    console.error("Error fetching artworks:", error);
    throw error;
  }
}

export async function getArtworkAction(id: string): Promise<{ status: string; message: string; data?: SelectArt }> {
  try {
    const artwork = await getArtwork(id);
    if (!artwork) {
      return { status: "error", message: "Artwork not found" };
    }
    return { status: "success", message: "Artwork retrieved successfully", data: artwork };
  } catch (error) {
    console.error("Error getting artwork by ID:", error);
    return { status: "error", message: "Failed to get artwork" };
  }
}

export async function updateArtworkAction(id: string, data: Partial<InsertArt>): Promise<{ status: string; message: string; data?: SelectArt }> {
  try {
    const updatedArtwork = await updateArtwork(id, data);
    revalidatePath("/art");
    return { status: "success", message: "Artwork updated successfully", data: updatedArtwork };
  } catch (error) {
    console.error("Error updating artwork:", error);
    return { status: "error", message: "Failed to update artwork" };
  }
}

export async function deleteArtworkAction(id: string): Promise<{ status: string; message: string }> {
  try {
    await deleteArtwork(id);
    revalidatePath("/art");
    return { status: "success", message: "Artwork deleted successfully" };
  } catch (error) {
    console.error("Error deleting artwork:", error);
    return { status: "error", message: "Failed to delete artwork" };
  }
}

export async function getRelatedArtworksAction(
  artworkId: string,
  artworkType: 'human' | 'ai'
): Promise<SelectArt[]> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let whereConditions: SQL[] = [];

    if (!user) {
      whereConditions.push(eq(artworksTable.published, true));
    }
    if (artworkType === 'ai') {
      const artwork = await db.select().from(artworksTable).where(eq(artworksTable.id, artworkId)).limit(1);
      const parentId = artwork[0]?.parentId;
      if (parentId) {
        whereConditions.push(
          and(
            ne(artworksTable.id, artworkId),
            or(
              eq(artworksTable.id, parentId),
              eq(artworksTable.parentId, parentId)
            )
          ) as SQL<unknown>
        );
      }
    } else {
      whereConditions.push(
        and(
          ne(artworksTable.id, artworkId),
          eq(artworksTable.parentId, artworkId)
        ) as SQL<unknown>
      );
    }

    const query = db
      .select()
      .from(artworksTable)
      .where(and(...whereConditions))
      .limit(10);

    const relatedArtworks = await query;
    return relatedArtworks;
  } catch (error) {
    console.error("Error fetching related artworks:", error);
    throw new Error(`Failed to fetch related artworks: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}