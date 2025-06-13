import React, { useEffect } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  useVideoConfig,
  interpolate,
  useCurrentFrame,
} from "remotion";

const InnerScene = ({ image, text, duration, transitionDuration, index }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, transitionDuration, duration - transitionDuration, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const scale = interpolate(
    frame,
    [0, duration / 2, duration],
    index % 2 === 0 ? [1, 1.1, 1] : [1.1, 1, 1.1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", opacity }}
    >
      <Img
        src={image}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
      <AbsoluteFill
        style={{
          color: "white",
          justifyContent: "center",
          bottom: 50,
          height: 150,
          textAlign: "center",
          width: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          padding: "10px 20px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2 className="text-2xl">{text}</h2>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

function RemotionVideo({
  script,
  imageList,
  audioFileUrl,
  setDurationInFrame,
  isPreview,
}) {
  const { fps } = useVideoConfig();

  if (!Array.isArray(imageList) || imageList.length === 0) {
    return (
      <AbsoluteFill className="bg-black flex justify-center items-center text-white">
        Loading...
      </AbsoluteFill>
    );
  }

  if (!Array.isArray(script) || script.length === 0) {
    return (
      <AbsoluteFill className="bg-black flex justify-center items-center text-white">
        Loading...
      </AbsoluteFill>
    );
  }

  const perSceneDuration = 3;
  const transitionDuration = 25;
  const totalDurationInFrames = perSceneDuration * imageList.length * fps;

  useEffect(() => {
    if (typeof setDurationInFrame === "function") {
      setDurationInFrame(totalDurationInFrames);
    }
  }, [totalDurationInFrames, setDurationInFrame]);

  const sceneDuration = totalDurationInFrames / imageList.length;

  return (
    <AbsoluteFill className="bg-black">
      {imageList.map((item, index) => {
        const startTime = Math.floor(index * sceneDuration);
        const duration = Math.floor(sceneDuration + transitionDuration);

        return (
          <Sequence key={index} from={startTime} durationInFrames={duration}>
            <InnerScene
              image={item}
              text={script[index]?.ContentText || ""}
              duration={duration}
              transitionDuration={transitionDuration}
              index={index}
              isPreview={isPreview}
            />
          </Sequence>
        );
      })}
      <Audio src={audioFileUrl} />
    </AbsoluteFill>
  );
}

export default RemotionVideo;
