// /app/dashboard/_components/PlayerDialog.js
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Player } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import { Button } from "@/components/ui/button";
import { db } from "@/configs/db";
import { VideoData } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function PlayerDialog({ playVideo, videoId }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [videoData, setVideoData] = useState();
  const [durationInFrame, setDurationInFrame] = useState(100);
  const [loadingExport, setLoadingExport] = useState(false);
  const [exportError, setExportError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (videoId) {
      setOpenDialog(true);
      GetVideoData();
    }
  }, [playVideo, videoId]);

  const GetVideoData = async () => {
    try {
      const result = await db
        .select()
        .from(VideoData)
        .where(eq(VideoData.id, videoId));
      setVideoData(result[0]);
    } catch (error) {
      console.error("Failed to fetch video data", error);
    }
  };

  const downloadVideo = async (videoData) => {
    try {
      setLoadingExport(true);
      setExportError(null);

      const baseUrl = "http://localhost:3000";
      // const baseUrl = "https://ai-vision-craft-generator.onrender.com";

      const makeAbsoluteUrl = (url) => {
        if (!url) return "";
        try {
          return new URL(url, baseUrl).href;
        } catch {
          console.warn("Invalid URL:", url);
          return url;
        }
      };

      const payload = {
        imageList: (videoData?.imageList || []).map(makeAbsoluteUrl),
        audioFileUrl: makeAbsoluteUrl(videoData?.audioFileUrl),
        script: videoData?.script || [],
      };

      const response = await fetch("http://localhost:4000/export-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Export failed: ${errorText}`);
      } 

      const data = await response.json();
      const base64Data = data?.result;

      if (!base64Data?.startsWith("data:video/mp4;base64,")) {
        throw new Error("Invalid video data format received");
      }

      // ✅ Decode base64 to Blob
      const base64String = base64Data.split(",")[1];
      const byteCharacters = atob(base64String);
      const byteArrays = [];

      for (let i = 0; i < byteCharacters.length; i += 1024) {
        const slice = byteCharacters.slice(i, i + 1024);
        const byteNumbers = new Array(slice.length);
        for (let j = 0; j < slice.length; j++) {
          byteNumbers[j] = slice.charCodeAt(j);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }

      const blob = new Blob(byteArrays, { type: "video/mp4" });
      const url = window.URL.createObjectURL(blob);

      // ✅ Trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `video-${videoData?.id || Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Video exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      setExportError(error.message || "Export failed");
    } finally {
      setLoadingExport(false);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="bg-white flex flex-col items-center">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold my-5">
            Your video is ready
          </DialogTitle>
          <DialogDescription>
            Watch the preview or export the video.
          </DialogDescription>
        </DialogHeader>

        {videoData && (
          <Player
            component={RemotionVideo}
            durationInFrames={Number(durationInFrame.toFixed(0)) + 100}
            compositionWidth={320}
            compositionHeight={450}
            fps={30}
            controls={true}
            inputProps={{
              ...videoData,
              setDurationInFrame: (frameValue) =>
                setDurationInFrame(frameValue),
              isPreview: false,
            }}
          />
        )}
        <div className="flex gap-10 mt-10">
          <Button
            variant="ghost"
            onClick={() => {
              router.replace("/dashboard");
              setOpenDialog(false);
            }}
            disabled={loadingExport}
          >
            Close
          </Button>
          {exportError && (
            <div className="text-red-600 mt-4">{exportError}</div>
          )}
          <Button
            onClick={() => downloadVideo(videoData)}
            disabled={loadingExport || !videoData}
          >
            {loadingExport ? "Exporting..." : "Export"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PlayerDialog;
