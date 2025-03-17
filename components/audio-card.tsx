'use client'

import React from "react";
import { MagicCard } from "@/components/ui/magic-card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Pause } from "lucide-react";
import Image from "next/image";
import { SelectAudio } from "@/db/schema/audios-schema";
import { Badge } from "@/components/ui/badge";

interface AudioCardProps {
  audio: SelectAudio;
}

export const AudioCard: React.FC<AudioCardProps> = ({ audio }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement actual play/pause functionality
  };

  return (
    <MagicCard className="w-full p-6 flex flex-col md:flex-row gap-6">
      <div className="flex flex-col  md:w-1/2  flex-grow">
        <Badge className="self-start mb-2">
          {audio.type === "mix" ? "Mix" : "Playlist"}
        </Badge>
        <h3 className="text-4xl font-bebas-neue font-semibold truncate">{audio.title}</h3>
        <p className="text-lg text-foreground/60 mt-2">{audio.description}</p>
      </div>
      <div className="relative w-full aspect-square overflow-hidden rounded-xl mb-4">

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
      </div>
    </MagicCard>
  );
};