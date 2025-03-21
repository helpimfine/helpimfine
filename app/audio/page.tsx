"use client";

import React from "react";
import { getAudiosAction } from "@/actions/audios-actions";
import { AudioCard } from "@/components/audio-card";
import { SelectAudio } from "@/db/schema/audios-schema";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import { useColors } from "@/app/context/color-context";
import { useSearchParams } from "next/navigation";

// Main page component that accepts search params
export default function AudioPage() {
  const { colorTones } = useColors();
  const searchParamsPromise = useSearchParams();
  const [audio, setAudio] = React.useState<{
    data: SelectAudio[],
    filteredData: SelectAudio[],
    allTags: string[],
    selectedTags: string[]
  }>({
    data: [],
    filteredData: [],
    allTags: [],
    selectedTags: []
  });
  
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Await the searchParams Promise
        const searchParams = await searchParamsPromise;
        
        // Parse the tags from URL (comma-separated string to array)
        const selectedTags = searchParams.get('tags') ? searchParams.get('tags')!.split(",") : [];
        
        // Get all audios
        const result = await getAudiosAction();
        
        if (result.status === "success") {
          const audios = result.data;
          
          // Filter the audios by tags if any are selected
          // Must match ALL selected tags, not just one
          const filteredAudios = selectedTags.length > 0
            ? audios.filter((audio: SelectAudio) => 
                selectedTags.every(tag => audio.tags?.includes(tag) ?? false)
              )
            : audios;
          
          // Get all unique tags
          const allTags = Array.from(
            new Set(
              audios
                .flatMap((audio: SelectAudio) => audio.tags || [])
                .filter(Boolean) as string[]
            )
          );
          
          setAudio({
            data: audios,
            filteredData: filteredAudios,
            allTags,
            selectedTags
          });
        }
      } catch (error) {
        console.error("Error fetching audio data:", error);
      }
    };
    
    fetchData();
  }, [searchParamsPromise]);

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Item animation
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="w-full">
      <div 
        className="w-full py-24 min-h-screen"
        style={{ 
          backgroundColor: colorTones ? colorTones[1][5] : 'transparent',
          color: colorTones ? colorTones[1][1] : 'inherit'
        }}
      >
        <div className="max-w-[95%] sm:max-w-[90%] lg:max-w-[80%] mx-auto">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-6 font-bebas-neue">Audio</h1>
            
            <div className="flex flex-wrap gap-2 mb-6 items-center">
              <TagLink 
                href="/audio" 
                isActive={audio.selectedTags.length === 0}
                label="All"
              />
              
              {audio.allTags.map((tag: string) => (
                <TagLink 
                  key={tag}
                  tag={tag}
                  selectedTags={audio.selectedTags}
                  label={tag}
                />
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {audio.filteredData.length === 0 && audio.data.length > 0 ? (
              <p>No audio content found.</p>
            ) : (
              audio.filteredData.map((item: SelectAudio, index: number) => (
                <motion.div 
                  key={item.id}
                  variants={itemVariants}
                >
                  <AudioCard audio={item} index={index} />
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Helper component for tag links with multi-select functionality
function TagLink({ 
  tag, 
  selectedTags = [], 
  href, 
  isActive = false, 
  label 
}: { 
  tag?: string; 
  selectedTags?: string[]; 
  href?: string; 
  isActive?: boolean; 
  label: string;
}) {
  const { colorTones } = useColors();
  
  // Define whether the tag is selected
  const isSelected = tag ? selectedTags.includes(tag) : false;
  
  // Define color depth values for consistency
  const bgColorDepth = 6;   // Use a moderate depth for visibility
  const textColorDepth = 0; // Lighter text for maximum contrast (was 1)
  const borderColorDepth = 4;
  
  // Theme-based style for tags
  const tagStyle = colorTones ? {
    backgroundColor: isActive || isSelected ? colorTones[0][bgColorDepth] : 'transparent',
    color: isActive || isSelected ? colorTones[0][textColorDepth] : colorTones[0][textColorDepth + 1],
    borderColor: colorTones[0][borderColorDepth],
  } : {};
  
  // Capitalize the first letter of the tag
  const displayLabel = label.charAt(0).toUpperCase() + label.slice(1);
  
  // If href is provided, use it directly (for "All" tag)
  if (href) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 1 }}
      >
        <Link href={href}>
          <Badge 
            variant={isActive ? "default" : "outline"}
            className="cursor-pointer flex items-center justify-center min-h-[28px]"
            style={tagStyle}
          >
            {displayLabel}
          </Badge>
        </Link>
      </motion.div>
    );
  }
  
  // Otherwise, handle multi-select logic
  // const isSelected = tag ? selectedTags.includes(tag) : false;
  
  // Create new URL with updated tag selection
  let newTags: string[];
  if (isSelected) {
    // Remove tag if already selected
    newTags = selectedTags.filter(t => t !== tag);
  } else {
    // Add tag if not selected
    newTags = [...selectedTags, tag!];
  }
  
  const newTagsParam = newTags.length > 0 ? newTags.join(',') : '';
  const newHref = newTagsParam ? `/audio?tags=${newTagsParam}` : '/audio';
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      animate={{ 
        scale: isSelected ? [1, 1.1, 1] : 1,
        transition: { 
          duration: isSelected ? 0.3 : 0.2 
        }
      }}
    >
      <Link href={newHref}>
        <Badge 
          variant={isSelected ? "default" : "outline"}
          className="cursor-pointer flex items-center gap-1 min-h-[28px]"
          style={tagStyle}
        >
          {displayLabel}
          {isSelected && (
            <span className="ml-1 rounded-full bg-foreground/20 w-4 h-4 flex items-center justify-center text-xs">
              ×
            </span>
          )}
        </Badge>
      </Link>
    </motion.div>
  );
}
