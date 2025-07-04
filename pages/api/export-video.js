import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";
import os from "os";

async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.statusText}`);
  const buffer = await res.buffer();
  await fs.writeFile(destPath, buffer);
  return destPath;
}

function escapeFFmpegText(text) {
  const clean = (text || "")
    .replace(/\\/g, "\\\\")
    .replace(/:/g, "\\:")
    .replace(/'/g, "\\'")
    .replace(/\r/g, "")
    .replace(/\n/g, " ")
    .slice(0, 200);

  return clean.replace(/(.{1,50})(\s|$)/g, "$1\\n").trim();
}

// ✅ Main handler for pages/api
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageList, audioFileUrl, script } = req.body;

    if (!Array.isArray(imageList) || !audioFileUrl || !Array.isArray(script)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const tempDir = path.join(os.tmpdir(), uuidv4());
    await fs.mkdir(tempDir, { recursive: true });

    const imageFiles = await Promise.all(
      imageList.map(async (url, i) => {
        const ext = path.extname(new URL(url).pathname) || ".jpg";
        const filePath = path.join(tempDir, `image_${i}${ext}`);
        return downloadFile(url, filePath);
      })
    );

    const audioExt = path.extname(new URL(audioFileUrl).pathname) || ".mp3";
    const audioFilePath = path.join(tempDir, `audio${audioExt}`);
    await downloadFile(audioFileUrl, audioFilePath);

    const fontPath = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"; // For Render/Linux
    const durationPerImage = 5;
    const videoSegments = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const text = escapeFFmpegText(script[i]?.ContentText || "");
      const outputVideo = path.join(tempDir, `video_${i}.mp4`);

      await new Promise((resolve, reject) => {
        ffmpeg()
          .input(imageFiles[i])
          .loop(durationPerImage)
          .videoFilter(
            `drawtext=fontfile='${fontPath}':text='${text}':fontcolor=white:fontsize=24:box=1:boxcolor=0x00000099:boxborderw=5:x=(w-text_w)/2:y=h-60`
          )
          .outputOptions(["-t", `${durationPerImage}`, "-r 30", "-pix_fmt yuv420p"])
          .save(outputVideo)
          .on("end", resolve)
          .on("error", reject);
      });

      videoSegments.push(outputVideo);
    }

    const filelistPath = path.join(tempDir, "filelist.txt");
    await fs.writeFile(filelistPath, videoSegments.map(v => `file '${v}'`).join("\n"));

    const tempConcatPath = path.join(tempDir, `concat_${uuidv4()}.mp4`);
    const finalOutputPath = path.join(tempDir, `output_${uuidv4()}.mp4`);

    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(filelistPath)
        .inputOptions(["-f concat", "-safe 0"])
        .videoCodec("libx264")
        .outputOptions(["-pix_fmt yuv420p", "-r 30"])
        .save(tempConcatPath)
        .on("end", resolve)
        .on("error", reject);
    });

    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(tempConcatPath)
        .input(audioFilePath)
        .outputOptions(["-c:v copy", "-c:a aac", "-shortest"])
        .save(finalOutputPath)
        .on("end", resolve)
        .on("error", reject);
    });

    const fileBuffer = await fs.readFile(finalOutputPath);
    const base64 = fileBuffer.toString("base64");

    await fs.rm(tempDir, { recursive: true, force: true });

    res.status(200).json({ result: `data:video/mp4;base64,${base64}` });
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({
      error: "Export failed",
      details: error.message,
    });
  }
}
