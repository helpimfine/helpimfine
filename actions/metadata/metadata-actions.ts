'use server'

import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { InsertArt } from '@/db/schema/artworks-schema';
import { createArtworkAction, updateArtworkAction } from '../artworks-actions';
import { generateObject } from 'ai';
import { metadataSystemPrompt } from './metadata-prompt';
import { generateTTS } from './tts';
import { uploadToBlob } from '@/actions/metadata/blob-storage';

const larasPhrases = [
  "queen Lara", "mate", "bitches", "lol", "prosecco", "cigarettes", "DMC", "vape", "party",
  "standard", "party queen", "my sister Emily", "sassy", "mean gays", "low-key", "proceccy",
  "watermelon elf bar", "my love for sausages", "my love for meat sticks"
];

const metadataSchema = z.object({
  artwork_metadata: z.object({
    title: z.string().describe("If the user provides a title, use it. Otherwise, craft a title that's sharp, witty, and captures or describes artwork’s essence. Think of something that feels amusing but above specific to the objects/colours/textures the comprise the collage or image. Keep it in sentence case with a full stop, and make sure it’s specific and memorable."),
    description: z.string().describe("Craft a detailed description for website visitors, balancing objective details with a touch of artistic interpretation to engage the viewer. Your tone should be matter-of-fact, yet engaging. Focus on clearly describing the artwork's elements, such as patterns, colours, textures, and emotions evoked but don't use words like 'juxtapose' or 'captivating' or other jargon."),   
    accessibilityDescription: z.string().describe("A comprehensive visual description of the artwork, detailing colors, shapes, textures, and composition. Describe the scene or subject matter thoroughly, including any notable elements or patterns. Provide a clear and vivid account that helps someone visualize the artwork without seeing it."),
    mainObjects: z.array(z.string()).describe("Identify the main objects, including patterns, colors, shapes, and identifiable textures."),
    tags: z.array(z.string()).describe("Generate relevant tags that categorize the image based on its content and potential emotional impact."),
    emotions: z.array(z.string()).describe("Pinpoint the emotions the artwork might evoke based on its content, color palette, and overall mood."),
    review: z.string().describe(`Review: Provide your critical view on how you rate the image, be sassy, direct and rude if that's your opinion. Use phrases like ${larasPhrases.map(phrase => `"${phrase}"`).join(', ')}. Aim for a humorous, irreverent tone that might make the reader chuckle.`),
  }),
});

type GenerateArtworkMetadataResult = {
  status: 'success' | 'error';
  message: string;
  data?: Partial<InsertArt> | null;
};

export async function generateArtworkMetadata(imageUrl: string, title: string, artType: string, userId: string, cloudinaryData: any, information: string, existingArtworkId?: string): Promise<GenerateArtworkMetadataResult> {
  try {
    console.log('Starting generateArtworkMetadata with:', { imageUrl, title, type: artType, userId, existingArtworkId });
    console.log('Cloudinary data:', cloudinaryData);

    const artTypePrompt = artType.toLowerCase() === 'human' ? 'digital collage' : 'ai artwork';
    console.log('Generating metadata with OpenAI...');

    const openaiInput = {
      model: openai('gpt-4o'),
      temperature: 0.8,
      schema: metadataSchema,
      system: metadataSystemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyse this ${artTypePrompt}-created image. Focus on identifying details, patterns, and distinct elements in the artwork. Use the information provided: ${information}.`
            },
            {
              type: 'image',
              image: imageUrl
            }
          ]
        }
      ],
      mode: 'json',
    };
    console.log('Sending to OpenAI:', openaiInput);
    const result = await generateObject(openaiInput as any);

    console.log('OpenAI result:', result);

    const metadata = metadataSchema.parse(result.object).artwork_metadata;
    console.log('Parsed metadata:', metadata);

    let finalResult;
    if (existingArtworkId) {
      console.log('Updating existing artwork...');
      finalResult = await updateExistingArtwork(existingArtworkId, metadata);
    } else {
      console.log('Creating new artwork...');
      finalResult = await parseAndSaveArtwork(metadata, imageUrl, artType.toLowerCase() as 'human' | 'ai', userId, cloudinaryData);
    }

    console.log('Final result:', finalResult);

    return { 
      status: "success", 
      message: `Artwork metadata ${existingArtworkId ? 'updated' : 'generated and saved'} successfully`,
      data: finalResult as Partial<InsertArt> | null | undefined
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    return { status: "error", message: `Failed to generate and save artwork metadata: ${(error as Error).message}`, data: null };
  }
}

async function parseAndSaveArtwork(metadata: Partial<InsertArt>, imageUrl: string, type: 'human' | 'ai', userId: string, cloudinaryData: any) {
  console.log('Parsing and saving artwork...');
  try {
    const colors = parseColors(cloudinaryData.colors);
    console.log('Parsed colors:', colors);

    console.log('Generating TTS...');
    const ttsAudioBuffer = await generateTTS((metadata.review as string) || '');
    console.log('TTS generated, buffer length:', ttsAudioBuffer.byteLength);
    console.log('Uploading to blob storage...');
    const audioUrl = await uploadToBlob(Buffer.from(ttsAudioBuffer), 'audio/mpeg', `review-${Date.now()}.mp3`);
    console.log('Uploaded to blob storage, URL:', audioUrl);

    const artworkData: InsertArt = {
      ...metadata,
      type,
      imageUrl,
      colours: JSON.stringify(colors),
      userId,
      published: false,
      reviewAudioUrl: audioUrl,
    } as InsertArt;

    console.log('Artwork data to save:', artworkData);
    const result = await createArtworkAction(artworkData);
    console.log('Artwork saved, result:', result);
    return result;
  } catch (error) {
    console.error('Error in parseAndSaveArtwork:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

async function updateExistingArtwork(id: string, metadata: Partial<InsertArt>) {
  console.log('Updating existing artwork:', id);
  console.log('Update metadata:', metadata);
  return (await updateArtworkAction(id, metadata)).data;
}

function parseColors(colors: [string, number][] | string): { description: string; hex: string }[] {
  console.log('Parsing colors:', colors);
  if (typeof colors === 'string') {
    try {
      colors = JSON.parse(colors);
    } catch (error) {
      console.error("Error parsing colors:", error);
      return [];
    }
  }
  
  const parsedColors = Array.isArray(colors) ? colors.map(([hex]) => ({ description: '', hex })) : [];
  console.log('Parsed colors:', parsedColors);
  return parsedColors;
}
