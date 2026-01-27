interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export function CameraPreview({ videoRef, canvasRef }: CameraPreviewProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto bg-black rounded-lg overflow-hidden shadow-2xl">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-auto"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
}
