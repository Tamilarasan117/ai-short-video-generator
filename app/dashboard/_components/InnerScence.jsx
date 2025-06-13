const InnerScene = ({
  image,
  text,
  duration,
  transitionDuration,
  index,
  isPreview,
}) => {
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
          height: isPreview ? 60 : 150,
          textAlign: "center",
          width: "100%",
          backgroundColor: isPreview
            ? "rgba(0, 0, 0, 0.5)"
            : "rgba(0, 0, 0, 0.3)",
          backdropFilter: isPreview ? undefined : "blur(8px)",
          WebkitBackdropFilter: isPreview ? undefined : "blur(8px)",
          padding: isPreview ? "12px 20px" : "20px 30px",
          borderRadius: isPreview ? "8px" : "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2
          style={{
            fontSize: isPreview ? "11px" : "20px",
            lineHeight: isPreview ? "1.3" : "1.5",
            margin: 0,
            fontWeight: 500,
            width: "100%",
            padding: isPreview ? "4px" : "8px 12px",
            whiteSpace: "normal",
            wordWrap: "break-word",
            overflow: "visible",
            textOverflow: "unset",
          }}
        >
          {text}
        </h2>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
