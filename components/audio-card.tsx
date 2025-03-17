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
import { useColors } from "@/app/context/color-context";

interface AudioCardProps {
  audio: SelectAudio;
  index?: number;
}

export const AudioCard: React.FC<AudioCardProps> = ({ audio, index = 0 }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { colorTones } = useColors();
  
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

  // Determine color tone variation based on index
  // Use modulo 3 to alternate between 3 different variations
  const colorVariation = index % 3;
  
  // Set different color depths for different cards
  const bgColorDepth = [4, 5, 6][colorVariation];  // Lighter to darker
  const textColorDepth = [2, 1, 0][colorVariation]; // Darker to lighter
  const borderColorDepth = [3, 4, 5][colorVariation];

  // Only apply custom styles if colorTones are available
  const cardStyle = colorTones ? {
    backgroundColor: colorTones[0][bgColorDepth],
    color: colorTones[0][textColorDepth],
    borderColor: colorTones[0][borderColorDepth],
    borderWidth: '1px',
    borderStyle: 'solid'
  } : {};

  // Badge style with complementary color
  const badgeStyle = colorTones ? {
    backgroundColor: colorTones[1][bgColorDepth],
    color: colorTones[1][textColorDepth],
  } : {};

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <MagicCard 
        className="w-full p-6 flex flex-col md:flex-row gap-6 overflow-hidden"
        style={cardStyle}
      >
        <div className="flex flex-col md:w-1/2 flex-grow">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Badge 
              className="self-start mb-2"
              style={badgeStyle}
            >
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
            className="text-lg mt-2"
            style={{ opacity: 0.8 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
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
              {audio.tags.map((tag, tagIndex) => {
                const isSelected = currentTags.includes(tag);
                const href = createTagLink(tag);
                
                // Slightly varying tag colors for visual interest
                const tagVariation = (index + tagIndex) % 5;
                const tagStyle = colorTones ? {
                  backgroundColor: isSelected ? colorTones[1][bgColorDepth] : 'transparent',
                  color: isSelected ? colorTones[1][textColorDepth] : colorTones[0][textColorDepth],
                  borderColor: colorTones[1][borderColorDepth],
                } : {};
                
                return (
                  <motion.div
                    key={tagIndex}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href={href}>
                      <Badge 
                        variant={isSelected ? "default" : "outline"} 
                        className="cursor-pointer hover:bg-accent"
                        style={tagStyle}
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
          style={colorTones ? {
            boxShadow: `0 4px 20px rgba(${parseInt(colorTones[0][0].slice(1, 3), 16)}, ${parseInt(colorTones[0][0].slice(3, 5), 16)}, ${parseInt(colorTones[0][0].slice(5, 7), 16)}, 0.3)`
          } : {}}
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