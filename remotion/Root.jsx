import RemotionVideo from "@/app/dashboard/_components/RemotionVideo";
import { Composition } from "remotion";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="Empty"
        component={RemotionVideo}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          script: [],
          imageList: [],
          audioFileUrl: "",
        }}
      />
    </>
  );
};
