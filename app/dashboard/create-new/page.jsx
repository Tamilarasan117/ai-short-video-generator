"use client";

import React, { useContext, useEffect, useState } from "react";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import { Button } from "@/components/ui/button";
import axios from "axios";
import CustomLoading from "./_components/CustomLoading";
import { v4 as uuidv4 } from "uuid";
import { VideoDataContext } from "@/app/_context/VideoDataContext";
import { UserDetailContext } from "@/app/_context/UserDetailContext";
import { db } from "@/configs/db";
import { Users, VideoData } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import PlayerDialog from "../_components/PlayerDialog";

function CreateNew() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const [videoId, setVideoid] = useState();

  const { videoData, setVideoData } = useContext(VideoDataContext);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { user } = useUser();

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const onCreateClickHandler = () => {
    if (userDetail?.credits <= 0) {
      toast("You don't have enough Credits");
      return;
    }
    GetVideoScript();
  };

  const GetVideoScript = async () => {
    setLoading(true);
    const prompt = `Write a script to generate ${formData.duration} video on topic: ${formData.topic} along with AI image prompt in ${formData.imageStyle} style for each scene and return JSON with fields imagePrompt and ContentText. No plain text.`;

    try {
      const resp = await axios.post("/api/get-video-script", { prompt });

      if (resp.data.result) {
        setVideoData((prev) => ({
          ...prev,
          videoScript: resp.data.result,
        }));
        await GenerateAudioFile(resp.data.result);
      } else {
        toast.error("Server error: Refresh and try again");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong generating script.");
    } finally {
      setLoading(false);
    }
  };

  const GenerateAudioFile = async (videoScriptData) => {
    setLoading(true);
    let script = videoScriptData.map((item) => item.ContentText).join(" ");
    const id = uuidv4();

    try {
      const resp = await axios.post("/api/generate-audio", {
        text: script,
        id: id,
      });

      if (resp.data.result) {
        setVideoData((prev) => ({
          ...prev,
          audioFileUrl: resp.data.result,
        }));
        await GenerateImages(videoScriptData);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error generating audio");
    } finally {
      setLoading(false);
    }
  };

  const GenerateImages = async (videoScriptData) => {
    setLoading(true);
    const images = [];

    for (const element of videoScriptData) {
      try {
        const resp = await axios.post("/api/generate-image", {
          prompt: element.imagePrompt,
        });
        images.push(resp.data.result);
      } catch (error) {
        console.error("Error generating image:", error);
        images.push("/placeholder.jpg");
      }
    }

    setVideoData((prev) => ({
      ...prev,
      imageList: images,
    }));
    setLoading(false);
  };

  useEffect(() => {
    if (
      videoData?.videoScript &&
      videoData?.audioFileUrl &&
      videoData?.imageList?.length > 0
    ) {
      SaveVideoData(videoData);
    }
  }, [videoData]);

  const SaveVideoData = async (videoData) => {
    try {
      setLoading(true);
      const result = await db
        .insert(VideoData)
        .values({
          script: videoData.videoScript,
          audioFileUrl: videoData.audioFileUrl ?? "",
          imageList: videoData.imageList ?? [],
          createdBy: user?.primaryEmailAddress?.emailAddress ?? "",
        })
        .returning({
          id: VideoData.id,
        });

      if (result?.length > 0) {
        await UpdateUserCredits();
        setVideoid(result[0].id);
        setPlayVideo(true);
      } else {
        toast.error("Failed to save video. Try again.");
      }
    } catch (error) {
      console.error("Error saving video:", error);
      toast.error("Error saving video.");
    } finally {
      setLoading(false);
    }
  };

  const UpdateUserCredits = async () => {
    await db
      .update(Users)
      .set({
        credits: userDetail?.credits - 10,
      })
      .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));

    setUserDetail((prev) => ({
      ...prev,
      credits: userDetail?.credits - 10,
    }));
  };

  return (
    <div className="md:px-20">
      <h2 className="font-bold text-4xl text-primary text-center">
        Create New
      </h2>

      <div className="mt-10 shadow-md p-10">
        <SelectTopic onUserSelect={onHandleInputChange} />
        <SelectStyle onUserSelect={onHandleInputChange} />
        <SelectDuration onUserSelect={onHandleInputChange} />
        <Button className="mt-10 w-full" onClick={onCreateClickHandler}>
          Create Short Video
        </Button>
      </div>

      <CustomLoading loading={loading} />
      <PlayerDialog playVideo={playVideo} videoId={videoId} />
    </div>
  );
}

export default CreateNew;
