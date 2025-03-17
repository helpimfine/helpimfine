"use client";

import React from "react";
import { getAudiosAction } from "@/actions/audios-actions";
import { AudioCard } from "@/components/audio-card";
import { SelectAudio } from "@/db/schema/audios-schema";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import { useColors } from "@/app/context/color-context";

export default function AudioPage({
  searchParams,
}: {
  searchParams: { tags?: string };
}) {
  const { colorTones } = useColors();
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
    // Parse the tags from URL (comma-separated string to array)
    const selectedTags = searchParams.tags ? searchParams.tags.split(",") : [];
    
    const fetchData = async () => {
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
    };
    
    fetchData();
  }, [searchParams.tags]);

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

  if (audio.data.length === 0) {
    return (
      <div className="w-full py-24 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div 
        className="w-full py-24"
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
            
            <div className="flex flex-wrap gap-2 mb-6">
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
            {audio.filteredData.length === 0 ? (
              <p>No audio content found.</p>
            ) : (
              audio.filteredData.map((item: SelectAudio) => (
                <motion.div 
                  key={item.id}
                  variants={itemVariants}
                >
                  <AudioCard audio={item} />
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
  // If href is provided, use it directly (for "All" tag)
  if (href) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link href={href}>
          <Badge 
            variant={isActive ? "default" : "outline"}
            className="cursor-pointer"
          >
            {label}
          </Badge>
        </Link>
      </motion.div>
    );
  }
  
  // Otherwise, handle multi-select logic
  const isSelected = tag ? selectedTags.includes(tag) : false;
  
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
      whileTap={{ scale: 0.95 }}
    >
      <Link href={newHref}>
        <Badge 
          variant={isSelected ? "default" : "outline"}
          className="cursor-pointer flex items-center gap-1"
        >
          {label}
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
