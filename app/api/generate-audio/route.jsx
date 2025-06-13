import { NextResponse } from "next/server";
import textToSpeech from "@google-cloud/text-to-speech";
import cloudinary from "@/configs/CloudinaryConfig";

const client = new textToSpeech.TextToSpeechClient({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req) {
  const { text, id } = await req.json();

  const request = {
    input: { text },
    voice: { languageCode: "en-US", ssmlGender: "FEMALE" },
    audioConfig: { audioEncoding: "MP3" },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    const audioBuffer = Buffer.from(response.audioContent, "binary");

    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          public_id: `ai-short-video-files/${id}`,
          folder: "ai-short-video-files",
          format: "mp3",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(audioBuffer);
    });

    return NextResponse.json({ result: uploadResponse.secure_url });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ error: "Audio generation/upload failed" }, { status: 500 });
  }
}
