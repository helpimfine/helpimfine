import React, { useState, useEffect } from "react";
import { SelectArt, InsertArt } from "@/db/schema/artworks-schema";
import { getArtworksAction, updateArtworkAction, deleteArtworkAction } from "@/actions/artworks-actions";
import { generateArtworkMetadata } from "@/actions/metadata/metadata-actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Trash2, Wand2, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateColorTones, computeTextColor } from "@/utils/color-utils";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useRouter } from "next/navigation";

interface EditArtworkProps {
  artwork: SelectArt;
  onClose: () => void;
  onSubmit: (updatedArtwork: Partial<InsertArt>) => Promise<void>;
  onDelete: () => void;
}

export function EditArtwork({ artwork, onClose, onSubmit, onDelete }: EditArtworkProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<InsertArt>>({
    title: artwork.title || "",
    type: artwork.type || "human",
    description: artwork.description || "",
    imageUrl: artwork.imageUrl || "",
    accessibilityDescription: artwork.accessibilityDescription || "",
    mainObjects: artwork.mainObjects || [],
    tags: artwork.tags || [],
    emotions: artwork.emotions || [],
    published: artwork.published || false,
    parentId: artwork.parentId || null,
  });
  const [humanArtworks, setHumanArtworks] = useState<SelectArt[]>([]);
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");

  useEffect(() => {
    async function fetchHumanArtworks() {
      try {
        const result = await getArtworksAction({
          page: "1",
          pageSize: "100",
          query: "",
          type: "human",
          published: "all",
          sortOrder: "desc",
          sortBy: "created"
        }, true);
        if (result.status === "success") {
          setHumanArtworks(result.data);
        }
      } catch (error) {
        console.error("Error fetching human artworks:", error);
      }
    }
    fetchHumanArtworks();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleArrayInput = (field: "mainObjects" | "tags" | "emotions", value: string) => {
    if (value.trim()) {
      setFormData(prev => ({ ...prev, [field]: [...prev[field] || [], value.trim()] }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, field: "mainObjects" | "tags" | "emotions") => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleArrayInput(field, e.currentTarget.value);
      e.currentTarget.value = '';
    }
  };

  const removeArrayItem = (field: "mainObjects" | "tags" | "emotions", index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.filter((item: any, i: number) => i !== index) || []
    }));
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    const submissionData = { ...formData };
    if (submissionData.type === 'human' || !submissionData.parentId) {
      delete submissionData.parentId;
    }
    try {
      const result = await updateArtworkAction(artwork.id, submissionData);
      if (result.status === "success") {
        await onSubmit(submissionData);
        onClose();
        // Dispatch custom event
        window.dispatchEvent(new Event('artworkUpdated'));
      } else {
        console.error("Failed to update artwork:", result.message);
      }
    } catch (error) {
      console.error("Failed to update artwork:", error);
    }
  };

  const handleDelete = async () => {
    if (artwork.id && confirmDelete === formData.title) {
      const result = await deleteArtworkAction(artwork.id);
      if (result.status === "success") {
        onDelete();
        onClose();
        // Dispatch custom event
        window.dispatchEvent(new Event('artworkUpdated'));
      } else {
        console.error("Failed to delete artwork:", result.message);
      }
    }
  };
  const handleAIRegenerate = async () => {
    setIsRegenerating(true);
    try {
      console.log("Starting AI regeneration...");
      console.log("Artwork data:", {
        imageUrl: artwork.imageUrl,
        title: artwork.title,
        type: artwork.type,
        userId: artwork.userId,
        colours: artwork.colours,
        id: artwork.id
      });
      console.log("Additional instructions:", additionalInstructions);

      // Parse colours if it's a string, otherwise use as is
      const parsedColours = typeof artwork.colours === 'string' 
        ? JSON.parse(artwork.colours) 
        : artwork.colours;

      const result = await generateArtworkMetadata(
        artwork.imageUrl ?? '', // Provide empty string as fallback
        artwork.title,
        artwork.type,
        artwork.userId,
        { colors: parsedColours },
        additionalInstructions,
        artwork.id
      );
      
      console.log("AI regeneration result:", result);
      
      if (result.status === "success" && result.data) {
        console.log("Updating form data with regenerated metadata...");
        setFormData(prev => {
          const newData = {
            ...prev,
            ...result.data,
            imageUrl: artwork.imageUrl, // Preserve the original image URL
            colours: artwork.colours, // Preserve the original colours
          };
          console.log("New form data:", newData);
          return newData;
        });
        console.log("Form data updated successfully.");
      } else {
        console.error("Failed to regenerate artwork metadata:", result.message);
      }
    } catch (error) {
      console.error("Error regenerating artwork metadata:", error);
    }
    setIsRegenerating(false);
  };

  const artworkColors = artwork.colours && Array.isArray(artwork.colours)
    ? artwork.colours.map((c: { hex: string }) => c.hex)
    : ['#D3D3D3', '#62757f', '#4B4B4B', '#8A9A5B', '#A0522D'];
  const colorTones = artworkColors.map(color => generateColorTones(color));

  // Function to get a safe color tone
  const getSafeColorTone = (index: number, subIndex: number) => {
    return colorTones[index % colorTones.length][subIndex];
  };

  return (
    <Card className="w-full h-[80vh] overflow-hidden border-none backdrop-blur-xl" style={{ background: `${colorTones[1][6]}80` }}>
      <CardHeader>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Artwork Title"
          className="mb-2 text-5xl font-bold w-full bg-transparent border-none outline-none font-bebas-neue"
          required
          style={{ color: colorTones[1][3] }}
        />
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(80vh-12rem)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-38 h-38 flex-shrink-0">
                <Image
                  src={formData.imageUrl || "/placeholder.svg"}
                  width={100}
                  height={100}
                  alt={formData.title ?? ""}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-center mb-2">
                  <Label htmlFor="published" className="mr-2 font-semibold text-xs text-muted-foreground uppercase" style={{ color: colorTones[1][4] }}>PUBLISHED</Label>
                  <Switch
                    id="published"
                    name="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="type" className="font-semibold text-xs text-muted-foreground uppercase" style={{ color: colorTones[1][4] }}>TYPE</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as "human" | "ai" }))}
                  >
                    <SelectTrigger id="type" className="w-full border-none bg-transparent" style={{ color: colorTones[1][2] }}>
                      <SelectValue placeholder="Select artwork type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="human">Human</SelectItem>
                      <SelectItem value="ai">AI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {formData.type === 'ai' && (
              <div className="space-y-1 pt-4">
                <Label htmlFor="parentId" className="font-semibold text-xs text-muted-foreground uppercase" style={{ color: colorTones[1][4] }}>PARENT ARTWORK</Label>
                <Select
                  value={formData.parentId || "none"}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value === "none" ? null : value }))}
                >
                  <SelectTrigger id="parentId" className="w-full border-none bg-transparent" style={{ color: colorTones[1][2] }}>
                    <SelectValue placeholder="Select parent artwork" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {humanArtworks.map((humanArtwork) => (
                      <SelectItem key={humanArtwork.id} value={humanArtwork.id}>
                        {humanArtwork.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1 pt-4">
              <Label htmlFor="description" className="font-semibold text-xs text-muted-foreground uppercase" style={{ color: colorTones[1][4] }}>DESCRIPTION</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                placeholder="Description"
                className="border-none bg-transparent resize-none overflow-hidden"
                style={{ color: colorTones[1][2] }}
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                }}
              />
            </div>

            <div className="space-y-1 pt-4">
              <Label htmlFor="imageUrl" className="font-semibold text-xs text-muted-foreground uppercase" style={{ color: colorTones[1][4] }}>IMAGE URL</Label>
              <Input
                id="imageUrl"
                type="text"
                name="imageUrl"
                value={formData.imageUrl || ""}
                onChange={handleInputChange}
                placeholder="Image URL"
                className="border-none bg-transparent"
                style={{ color: colorTones[1][2] }}
              />
            </div>

            <div className="space-y-1 pt-4">
              <Label htmlFor="accessibilityDescription" className="font-semibold text-xs text-muted-foreground uppercase" style={{ color: colorTones[1][4] }}>ACCESSIBILITY DESCRIPTION</Label>
              <Textarea
                id="accessibilityDescription"
                name="accessibilityDescription"
                value={formData.accessibilityDescription || ""}
                onChange={handleInputChange}
                placeholder="Accessibility Description"
                className="border-none bg-transparent resize-none overflow-hidden"
                style={{ color: colorTones[1][2] }}
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                }}
              />
            </div>

            <div className="space-y-1 pt-4">
              <Label htmlFor="mainObjects" className="font-semibold text-xs text-muted-foreground uppercase" style={{ color: colorTones[1][4] }}>MAIN OBJECTS</Label>
              <Input 
                id="mainObjects"
                onKeyDown={(e) => handleKeyPress(e, 'mainObjects')}
                placeholder="Add object and press Enter" 
                className="border-none bg-transparent"
                style={{ color: colorTones[1][2] }}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.mainObjects?.map((object: string, index: number) => (
                  <span 
                    key={index} 
                    className="text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center" 
                    style={{ 
                      backgroundColor: getSafeColorTone(index, 4), 
                      color: computeTextColor(getSafeColorTone(index, 4)) 
                    }}
                  >
                    {object}
                    <X className="w-4 h-4 ml-1 cursor-pointer" onClick={() => removeArrayItem('mainObjects', index)} />
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1 pt-4">
              <Label htmlFor="tags" className="font-semibold text-xs text-muted-foreground uppercase" style={{ color: colorTones[1][4] }}>TAGS</Label>
              <Input 
                id="tags"
                onKeyDown={(e) => handleKeyPress(e, 'tags')}
                placeholder="Add tag and press Enter" 
                className="border-none bg-transparent"
                style={{ color: colorTones[1][2] }}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags?.map((tag: string, index: number) => (
                  <span 
                    key={index} 
                    className="text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center" 
                    style={{ 
                      backgroundColor: getSafeColorTone(index, 4), 
                      color: computeTextColor(getSafeColorTone(index, 4)) 
                    }}
                  >
                    {tag}
                    <X className="w-4 h-4 ml-1 cursor-pointer" onClick={() => removeArrayItem('tags', index)} />
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1 pt-4">
              <Label htmlFor="emotions" className="font-semibold text-xs text-muted-foreground uppercase" style={{ color: colorTones[1][4] }}>EMOTIONS</Label>
              <Input 
                id="emotions"
                onKeyDown={(e) => handleKeyPress(e, 'emotions')}
                placeholder="Add emotion and press Enter" 
                className="border-none bg-transparent"
                style={{ color: colorTones[1][2] }}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.emotions?.map((emotion: string, index: number) => (
                  <span 
                    key={index} 
                    className="text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center" 
                    style={{ 
                      backgroundColor: getSafeColorTone(index, 4), 
                      color: computeTextColor(getSafeColorTone(index, 4)) 
                    }}
                  >
                    {emotion}
                    <X className="w-4 h-4 ml-1 cursor-pointer" onClick={() => removeArrayItem('emotions', index)} />
                  </span>
                ))}
              </div>
            </div>
          </form>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" className="p-2">
              <Trash2 className="h-5 w-5" style={{ color: colorTones[1][2] }} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-card/50 backdrop-blur-xl border-none">
            <div className="space-y-2">
            <h2 className="text-2xl pb-2">Are you sure?</h2>
              <Input
                id="confirmDelete"
                className="border-none bg-card/50 focus:outline-none focus:ring-0"
                placeholder="Enter artwork name to confirm"
                onChange={(e) => setConfirmDelete(e.target.value)}
              />
              <Button variant="destructive" onClick={handleDelete} disabled={confirmDelete !== formData.title}>
                Confirm Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" disabled={isRegenerating} className="p-2 border-none">
                <Wand2 className="h-5 w-5" style={{ color: colorTones[1][2] }} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-card/50 backdrop-blur-xl border-none">
            <h2 className="text-2xl pb-2">Regenerate metadata</h2>
              <div className="space-y-2">
                <Textarea
                  id="additionalInstructions"
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  placeholder="Enter any instructions for AI regeneration"
                  className="border-none bg-card/50 focus:outline-none focus:ring-0"
                />
                <Button onClick={handleAIRegenerate} disabled={isRegenerating} className="border-none">
                  {isRegenerating ? "Regenerating..." : "Regenerate"}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button type="button" variant="ghost" onClick={onClose} className="p-2">
            <X className="h-5 w-5" style={{ color: colorTones[1][2] }} />
          </Button>
          <Button type="submit" variant="ghost" onClick={handleSubmit} className="p-2">
            <Check className="h-5 w-5" style={{ color: colorTones[1][2] }} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
