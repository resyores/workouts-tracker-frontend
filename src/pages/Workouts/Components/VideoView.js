export default function VideoView({ WorkoutId, index, token }) {
  return (
    <video
      width="480"
      height="360"
      controls
      className="rounded mb-auto me-auto"
    >
      <source
        src={`${window.env.API}/SetVideo/${WorkoutId}/${index}/video.mp4?token=${token}`}
        type="video/mp4"
      />
    </video>
  );
}
