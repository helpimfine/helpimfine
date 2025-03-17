'use client'

import React from "react";
import { MagicCard } from "@/components/ui/magic-card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Pause } from "lucide-react";
import Image from "next/image";
import { SelectAudio } from "@/db/schema/audios-schema";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";

interface AudioCardProps {
  audio: SelectAudio;
}

export const AudioCard: React.FC<AudioCardProps> = ({ audio }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get current tags from URL
  const currentTags = searchParams.get('tags')?.split(',') || [];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement actual play/pause functionality
  };

  // Function to create href that adds a tag while preserving existing tags
  const createTagLink = (tag: string) => {
    if (currentTags.includes(tag)) {
      // Don't add if already selected
      return `${pathname}?tags=${currentTags.join(',')}`;
    }
    
    const newTags = [...currentTags, tag];
    return `${pathname}?tags=${newTags.join(',')}`;
  };

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <MagicCard className="w-full p-6 flex flex-col md:flex-row gap-6">
        <div className="flex flex-col md:w-1/2 flex-grow">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Badge className="self-start mb-2">
              {audio.type === "mix" ? "Mix" : "Playlist"}
            </Badge>
          </motion.div>
          
          <motion.h3 
            className="text-4xl font-bebas-neue font-semibold truncate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {audio.title}
          </motion.h3>
          
          <motion.p 
            className="text-lg text-foreground/60 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {audio.description}
          </motion.p>
          
          {audio.tags && audio.tags.length > 0 && (
            <motion.div 
              className="flex flex-wrap gap-2 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {audio.tags.map((tag, index) => {
                const isSelected = currentTags.includes(tag);
                const href = createTagLink(tag);
                
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href={href}>
                      <Badge 
                        variant={isSelected ? "default" : "outline"} 
                        className="cursor-pointer hover:bg-accent"
                      >
                        {tag}
                      </Badge>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
        
        <motion.div 
          className="relative w-full aspect-square overflow-hidden rounded-xl mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {audio.type === "Playlist" && audio.audioUrl ? (
            <iframe
              src={`https://open.spotify.com/embed/playlist/${audio.audioUrl.split('/').pop()}`}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="encrypted-media"
            ></iframe>
          ) : (
            <Image
              src={audio.imageUrl || "/placeholder.png"}
              alt={audio.title}
              layout="fill"
              objectFit="cover"
            />
          )}
        </motion.div>
      </MagicCard>
    </motion.div>
  );
};