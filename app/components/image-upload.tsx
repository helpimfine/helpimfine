import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InsertArt } from "@/db/schema/artworks-schema";
import { generateArtworkMetadata } from '@/actions/metadata/metadata-actions';
import crypto from 'crypto';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Textarea } from "@/components/ui/textarea";
import { createClient } from '@/utils/supabase/client';

const CLOUDINARY_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

interface ImageUploadProps {
  onUploadComplete: (artwork: InsertArt) => void;
}

export function ImageUpload({ onUploadComplete }: ImageUploadProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'human' | 'ai'>('human');
  const [information, setInformation] = useState('');
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();
  const [supabase, setSupabase] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function initializeSupabase() {
      const client = await createClient();
      setSupabase(client);
      
      const { data: { user } } = await client.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    }
    
    initializeSupabase();
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0 || !userId) return;
    
    setUploading(true);
    setStatus("Uploading to Cloudinary...");

    try {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size exceeds 10MB limit');
      }

      const cloudinaryData = await uploadToCloudinary(file);
      const imageUrl = cloudinaryData.secure_url;

      setStatus("Image uploaded. Processing...");

      const existingArtworkId = undefined;
      const result = await generateArtworkMetadata(imageUrl, title, type, userId, cloudinaryData, information, existingArtworkId);
      if (result.status === 'success' && result.data) {
        setStatus("Artwork saved!");
        // Ensure all required fields are present before calling onUploadComplete
        if (result.data.title && result.data.type && result.data.userId) {
          onUploadComplete(result.data as InsertArt);
          router.push(`/art/${result.data.id}`);
        } else {
          throw new Error('Incomplete artwork data received');
        }
      } else {
        throw new Error(result.message || 'Failed to generate metadata and save artwork');
      }
    } catch (error) {
      console.error('Error uploading artwork:', error);
      setStatus((error as Error).message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [title, type, userId, onUploadComplete, router, information]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    multiple: false,
  });

  if (!userId) {
    return <div>Loading user information...</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-4">
        <Input
          placeholder="Artwork Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-none"
        />
        <Select value={type} onValueChange={(value: 'human' | 'ai') => setType(value)}>
          <SelectTrigger className="border-none">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="human">Human</SelectItem>
            <SelectItem value="ai">AI</SelectItem>
          </SelectContent>
        </Select>
        <Textarea
          placeholder="Additional Information (optional)"
          value={information}
          onChange={(e) => setInformation(e.target.value)}
        />
      </div>
      <div 
        {...getRootProps()} 
        className={`bg-card/20 backdrop-blur-xl border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-border'
        }`}
      >
        <input {...getInputProps()}/>
        {uploading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="mb-2 h-8 w-8 animate-spin" />
            <p>{status || 'Uploading...'}</p>
          </div>
        ) : isDragActive ? (
          <p>Drop the image here ...</p>
        ) : (
          <p>Drop an image here, or click to select.</p>
        )}
      </div>
    </div>
  );
}

async function uploadToCloudinary(file: File) {
  if (!CLOUDINARY_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary configuration is missing');
  }

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`;

  const timestamp = Math.floor(Date.now() / 1000);
  const hashString = `colors=true&timestamp=${timestamp}&upload_preset=${CLOUDINARY_UPLOAD_PRESET}${CLOUDINARY_API_SECRET}`;
  const signature = crypto.createHash('sha1').update(hashString).digest('hex');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('colors', "true");
  formData.append('timestamp', timestamp.toString());
  formData.append('api_key', CLOUDINARY_API_KEY);
  formData.append('signature', signature);

  try {
    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error('Cloudinary response not OK:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Cloudinary error response:', errorText);
      throw new Error(`Failed to upload image to Cloudinary: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Cloudinary upload successful:', data);
    return data;
  } catch (error) {
    console.error('Error in uploadToCloudinary:', error);
    throw error;
  }
}