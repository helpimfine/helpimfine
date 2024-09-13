import React from "react";
import { getAudiosAction } from "@/actions/audios-actions";
import { AudioCard } from "@/components/audio-card";
import { SelectAudio } from "@/db/schema/audios-schema";

export default async function AudioPage() {
  const result = await getAudiosAction();

  if (result.status === "error") {
    return <div>Error: {result.message}</div>;
  }

  const audios = result.data;

  return (
    <div className="max-w-[95%] sm:max-w-[90%] lg:max-w-[80%] mx-auto py-24">
      <div className="grid grid-cols-1 gap-6">
        {audios.map((audio: SelectAudio) => (
          <AudioCard key={audio.id} audio={audio} />
        ))}
      </div>
    </div>
  );
}
