'use client'

import { SelectArt, InsertArt } from "@/db/schema/artworks-schema";
import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import TagList from "@/app/components/tag-list";
import { generateColorTones, computeTextColor } from "@/utils/color-utils";
import { MagicCard } from "@/components/ui/magic-card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2 } from "lucide-react";
import { EditArtwork } from "@/app/components/edit-artwork";
import { updateArtworkAction } from "@/actions/artworks-actions";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Play, Pause } from "lucide-react";

interface ArtworkDetailsProps {
  artwork: SelectArt;
}



export default function ArtworkDetails({ artwork }: ArtworkDetailsProps) {
  const [activeTab, setActiveTab] = useState("description");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = await createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkAuth();
  }, []);

  const artworkColors = artwork.colours && Array.isArray(artwork.colours)
    ? artwork.colours.map((c: { hex: string }) => c.hex)
    : ['#D3D3D3', '#62757f', '#4B4B4B', '#8A9A5B', '#A0522D'];
  const colorTones = artworkColors.map(color => generateColorTones(color));

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdateArtwork = async (updatedArtwork: Partial<InsertArt>) => {
    const result = await updateArtworkAction(artwork.id, updatedArtwork);
    if (result.status === "success") {
      setIsEditing(false);
      router.refresh(); // Refresh the page to show updated data
    } else {
      console.error("Failed to update artwork:", result.message);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (isEditing) {
    return (
      <EditArtwork
        artwork={artwork}
        onClose={() => setIsEditing(false)}
        onSubmit={handleUpdateArtwork}
        onDelete={() => router.push('/art/edit')}
      />
    );
  }

  return (
    <div>
      <MagicCard 
        className="overflow-hidden border-none backdrop-blur-xl relative cursor-pointer" 
        style={{ background: `${colorTones[1][6]}80` }}
        gradientColor={colorTones[1][3]}
      >
        {isLoggedIn && (
          <div className="absolute top-2 right-2 z-10">
            <Button variant="ghost" size="icon" className="hover:outline-none hover:bg-card/10" onClick={handleEdit}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        )}

        <Badge className="ml-6 mt-6 uppercase text-xl" variant="outline" style={{ color: colorTones[1][3], borderColor: colorTones[1][3] }}>{artwork.type}</Badge>

        <div className="w-full flex flex-col">
          <div className="relative pt-6 px-6">
            <h2 className="text-6xl font-bold" style={{ color: colorTones[1][3] }}>{artwork.title}</h2>
          </div>
          <div className="flex-grow overflow-hidden p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="w-full grid grid-cols-3" style={{ backgroundColor: colorTones[1][5] }}>
                {["description", "details", "review"].map((tab) => (
                  <TabsTrigger 
                    key={tab}
                    value={tab} 
                    className="w-full"
                    style={{ 
                      color: colorTones[1][1],
                      backgroundColor: activeTab === tab ? colorTones[1][4] : 'transparent'
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollArea className="flex-grow">
                <TabsContent value="description" className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-xs text-muted-foreground uppercase " style={{ color: colorTones[1][4] }}>DESCRIPTION</h3>
                    <p className="text-pretty text-xl" style={{ color: colorTones[1][2] }}>{artwork.description}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-xs text-muted-foreground uppercase" style={{ color: colorTones[1][4] }}>TAGS</h3>
                    <TagList tags={artwork.tags ?? []} colors={artworkColors} />
                  </div>
                </TabsContent>
                <TabsContent value="details" className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-xs text-muted-foreground uppercase" style={{ color: colorTones[1][4] }}>MAIN OBJECTS</h3>
                    <TagList tags={artwork.mainObjects ?? []} colors={artworkColors} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-xs text-muted-foreground uppercase" style={{ color: colorTones[1][4] }}>EMOTIONS</h3>
                    <TagList tags={artwork.emotions ?? []} colors={artworkColors} />
                  </div>
                  <div className="mt-4 space-y-2">
                    <h3 className="font-semibold text-xs text-muted-foreground uppercase" style={{ color: colorTones[1][4] }}>COLOURS</h3>
                    <div className="flex flex-wrap gap-2">
                      {artwork.colours && Array.isArray(artwork.colours) ? artwork.colours.map((colour, index) => (
                        <div
                          key={index}
                          className="px-2 py-2 rounded-3xl shadow-md flex flex-col items-center justify-center"
                          style={{ backgroundColor: colorTones[index][3] }}
                        >
                          {/* <p
                            className="text-lg font-bold capitalize"
                            style={{ color: computeTextColor(colorTones[index][3]) }}
                          >
                            {colour.description}
                          </p> */}
                        </div>
                      )) : null}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="review" className="mt-6 space-y-4">
                  <div>
                    <p className="italic text-lg font-serif font-light text-pretty pb-4" style={{ color: colorTones[1][2] }}>
                      {artwork.review ? JSON.stringify(artwork.review) : 'No review available.'}
                    </p>
                    <p className="text-xl" style={{ color: colorTones[1][3] }}>
                      –AI Lara
                    </p>
                    {artwork.reviewAudioUrl && (
                      <div className="mt-4">
                        <Button
                          onClick={togglePlayPause}
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: colorTones[1][5],
                            color: colorTones[1][3],
                          }}
                        >
                          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                        </Button>
                        <audio
                          ref={audioRef}
                          src={artwork.reviewAudioUrl}
                          onEnded={() => setIsPlaying(false)}
                          style={{ display: 'none' }}
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </MagicCard>
    </div>
  );
}