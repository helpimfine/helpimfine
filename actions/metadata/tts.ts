'use server';

const ELEVEN_LABS_API_KEY = "sk_dd7d8f72d397b9da6e7ef8dd8c52796feec65ba21d04cf43";
const VOICE_ID = 'qA68VS6AhoGRxdNTmpVG'; // Replace with your preferred voice ID

export async function generateTTS(text: string): Promise<ArrayBuffer> {
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': ELEVEN_LABS_API_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error('Error generating TTS:', error);
    throw error;
  }
}