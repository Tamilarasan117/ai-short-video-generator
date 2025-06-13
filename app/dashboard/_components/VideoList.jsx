import React, { useState } from "react";
import { Thumbnail } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import PlayerDialog from "./PlayerDialog";
function VideoList({ videoList }) {
  const [openPlayDialog, setOpenPlayerDialog] = useState(false);
  const [videoId, setVideoId] = useState();
  return (
    <div
      className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
        gap-10"
    >
      {videoList?.map((video, index) => (
        <div
          key={index}
          className="cursor-pointer 
                hover:scale-105 transition-all"
          onClick={() => {
            setOpenPlayerDialog(Date.now());
            setVideoId(video?.id);
          }}
        >
          <Thumbnail
            component={RemotionVideo}
            compositionWidth={320}
            compositionHeight={450}
            frameToDisplay={20}
            durationInFrames={120}
            fps={50}
            style={{
              borderRadius: 15,
            }}
            inputProps={{
              ...video,
              setDurationInFrame: (v) => console.log(v),
              isPreview: true, // 👈 Add this
            }}
          />
        </div>
      ))}
      <PlayerDialog playVideo={openPlayDialog} videoId={videoId} />
    </div>
  );
}

export default VideoList;
