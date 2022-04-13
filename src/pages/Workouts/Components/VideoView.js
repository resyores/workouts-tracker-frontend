import { useState, useEffect } from "react";
export default function VideoView({ WorkoutId, index, token, refreshVideo }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    setSrc(
      `${
        window.env.API
      }/SetVideo/${WorkoutId}/${index}/video.mp4?token=${token}&${Date.now()}`
    );
  }, [refreshVideo]);
  return (
    <video
      width="480"
      height="360"
      controls
      className="rounded mb-auto me-auto"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
