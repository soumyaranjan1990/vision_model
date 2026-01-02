
import React, { useRef, useEffect } from 'react';
import { Detection } from '../types';

interface Props {
  detections: Detection[];
  videoRef: React.RefObject<HTMLVideoElement>;
}

const VisionFeed: React.FC<Props> = ({ detections, videoRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const draw = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Adjust canvas to video size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      detections.forEach((det) => {
        const [x, y, w, h] = det.bbox;
        
        // Draw bounding box
        ctx.strokeStyle = '#76b900';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);

        // Draw label background
        ctx.fillStyle = 'rgba(118, 185, 0, 0.8)';
        ctx.fillRect(x, y - 20, ctx.measureText(det.label).width + 20, 20);

        // Draw label
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px JetBrains Mono';
        ctx.fillText(`${det.label} ${(det.confidence * 100).toFixed(0)}%`, x + 5, y - 5);
      });

      requestAnimationFrame(draw);
    };

    draw();
  }, [detections, videoRef]);

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden glass border-2 border-[#76b900]/30">
      <video 
        ref={videoRef}
        autoPlay 
        muted 
        playsInline 
        className="w-full h-full object-cover grayscale brightness-50"
      />
      <canvas 
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      
      {/* HUD Elements */}
      <div className="absolute top-4 left-4 flex gap-2">
        <div className="bg-black/80 px-3 py-1 border border-[#76b900] rounded flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#76b900] animate-pulse" />
          <span className="text-[10px] mono uppercase font-bold tracking-widest text-[#76b900]">Live Edge Feed</span>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="scanner-line" />
      </div>

      <div className="absolute bottom-4 right-4 flex flex-col items-end">
        <span className="text-[8px] mono text-gray-500 uppercase">Device: NV_XAVIER_AGX_001</span>
        <span className="text-[8px] mono text-gray-500 uppercase">Kernel: 5.10.104-TEGRA</span>
      </div>
    </div>
  );
};

export default VisionFeed;
