"use server";

import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { InsertArticle, SelectArticle, articlesTable } from "../schema/articles-schema";

export const createArticle = async (data: InsertArticle): Promise<SelectArticle> => {
  try {
    const [newArticle] = await db.insert(articlesTable).values(data).returning();
    return newArticle;
  } catch (error) {
    console.error("Error creating article:", error);
    throw new Error("Failed to create article");
  }
};

export const getArticles = async (userId: string): Promise<SelectArticle[]> => {
  try {
    return db.query.articles.findMany({
      where: eq(articlesTable.userId, userId)
    });
  } catch (error) {
    console.error("Error getting articles:", error);
    throw new Error("Failed to get articles");
  }
};

export const getArticle = async (id: string) => {
  try {
    const article = await db.query.articles.findFirst({
      where: eq(articlesTable.id, id)
    });
    if (!article) {
      throw new Error("Article not found");
    }
    return article;
  } catch (error) {
    console.error("Error getting article by ID:", error);
    throw new Error("Failed to get article");
  }
};

export const updateArticle = async (id: string, data: Partial<InsertArticle>): Promise<SelectArticle> => {
  try {
    const [updatedArticle] = await db.update(articlesTable).set(data).where(eq(articlesTable.id, id)).returning();
    return updatedArticle;
  } catch (error) {
    console.error("Error updating article:", error);
    throw new Error("Failed to update article");
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  try {
    await db.delete(articlesTable).where(eq(articlesTable.id, id));
  } catch (error) {
    console.error("Error deleting article:", error);
    throw new Error("Failed to delete article");
  }
};