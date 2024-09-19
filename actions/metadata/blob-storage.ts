'use server'

import { put } from '@vercel/blob';

export async function uploadToBlob(buffer: Buffer, contentType: string, filename: string): Promise<string> {
  try {
    const { url } = await put(filename, buffer, {
      contentType,
      access: 'public',
    });
    return url;
  } catch (error) {
    console.error('Error uploading to blob storage:', error);
    throw error;
  }
}