"use server";

import { createAudio, getAudios, getAudio, updateAudio, deleteAudio } from "@/db/queries/audios-queries";
import { InsertAudio } from "@/db/schema/audios-schema";
import { revalidatePath } from "next/cache";

export interface ActionState {
    status: 'success' | 'error';
    message: string;
    data?: any;
}

export async function createAudioAction(audio: InsertAudio): Promise<ActionState> {
  try {
    const newAudio = await createAudio(audio);
    revalidatePath("/audios");
    return { status: "success", message: "Audio created successfully", data: newAudio };
  } catch (error) {
    console.error("Error creating audio:", error);
    return { status: "error", message: "Failed to create audio" };
  }
}

export async function getAudiosAction(tag?: string): Promise<ActionState> {
  try {
    const audios = await getAudios(tag);
    return { status: "success", message: "Audios retrieved successfully", data: audios };
  } catch (error) {
    console.error("Error getting audios:", error);
    return { status: "error", message: "Failed to get audios" };
  }
}

export async function getAudioAction(id: string): Promise<ActionState> {
  try {
    const audio = await getAudio(id);
    return { status: "success", message: "Audio retrieved successfully", data: audio };
  } catch (error) {
    console.error("Error getting audio by ID:", error);
    return { status: "error", message: "Failed to get audio" };
  }
}

export async function updateAudioAction(id: string, data: Partial<InsertAudio>): Promise<ActionState> {
  try {
    const updatedAudio = await updateAudio(id, data);
    revalidatePath("/audios");
    return { status: "success", message: "Audio updated successfully", data: updatedAudio };
  } catch (error) {
    console.error("Error updating audio:", error);
    return { status: "error", message: "Failed to update audio" };
  }
}

export async function deleteAudioAction(id: string): Promise<ActionState> {
  try {
    await deleteAudio(id);
    revalidatePath("/audios");
    return { status: "success", message: "Audio deleted successfully" };
  } catch (error) {
    console.error("Error deleting audio:", error);
    return { status: "error", message: "Failed to delete audio" };
  }
}