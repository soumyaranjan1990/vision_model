
import React, { useState, useEffect, useRef } from 'react';
import { DeviceTelemetry, Detection, SceneInsight } from './types';
import TelemetryGrid from './components/TelemetryGrid';
import VisionFeed from './components/VisionFeed';
import InsightPanel from './components/InsightPanel';
import { geminiService } from './services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Mock data generator for Xavier Edge
const generateMockTelemetry = (): DeviceTelemetry => ({
  gpuUsage: 45 + Math.random() * 40,
  cpuUsage: 20 + Math.random() * 30,
  ramUsage: 12.4 + Math.random() * 2,
  temp: 58 + Math.random() * 10,
  fps: 28 + Math.random() * 4,
  status: 'online'
});

const generateMockDetections = (): Detection[] => {
  const labels = ['Person', 'Pallet', 'Forklift', 'Safety Vest'];
  return Array.from({ length: 3 + Math.floor(Math.random() * 3) }).map((_, i) => ({
    id: `det-${i}`,
    label: labels[Math.floor(Math.random() * labels.length)],
    confidence: 0.85 + Math.random() * 0.14,
    bbox: [
      100 + Math.random() * 300, 
      100 + Math.random() * 200, 
      50 + Math.random() * 100, 
      100 + Math.random() * 150
    ],
    timestamp: Date.now()
  }));
};

const App: React.FC = () => {
  const [telemetry, setTelemetry] = useState<DeviceTelemetry>(generateMockTelemetry());
  const [detections, setDetections] = useState<Detection[]>(generateMockDetections());
  const [telemetryHistory, setTelemetryHistory] = useState<any[]>([]);
  const [insight, setInsight] = useState<SceneInsight | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasCaptureRef = useRef<HTMLCanvasElement>(null);

  // Initialize camera
  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: 1280, height: 720 } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera failed:", err);
      }
    }
    setupCamera();
  }, []);

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const newTelem = generateMockTelemetry();
      setTelemetry(newTelem);
      setDetections(generateMockDetections());
      setTelemetryHistory(prev => [...prev.slice(-20), { time: new Date().toLocaleTimeString(), gpu: newTelem.gpuUsage, fps: newTelem.fps }]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleDeepAnalyze = async () => {
    if (!videoRef.current) return;
    setIsAnalyzing(true);

    try {
      // Capture current frame
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        const detSummary = detections.map(d => `${d.label} at 80% confidence`).join(', ');
        
        const result = await geminiService.analyzeScene(base64, detSummary);
        setInsight(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 gap-4">
      {/* Header */}
      <header className="flex justify-between items-center glass p-4 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="p-2 nvidia-bg rounded">
            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.5 12c0 5.8-4.7 10.5-10.5 10.5S1.5 17.8 1.5 12 6.2 1.5 12 1.5 22.5 6.2 22.5 12zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z"/>
              <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3-3-1.34-3-3-3z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tighter uppercase italic">Nexus<span className="text-[#76b900]">Edge</span></h1>
            <p className="text-[10px] mono text-gray-500 tracking-widest uppercase">Autonomous Edge Vision Ecosystem</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <div className="text-right">
            <div className="text-[10px] text-gray-500 mono uppercase">System Status</div>
            <div className="text-xs font-bold text-[#76b900] flex items-center gap-1 justify-end">
              <div className="w-1.5 h-1.5 rounded-full bg-[#76b900]" /> OPERATIONAL
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-500 mono uppercase">Connectivity</div>
            <div className="text-xs font-bold text-blue-400">LATENCY: 12ms</div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        
        {/* Left Panel: Feed and Insights */}
        <div className="lg:col-span-8 flex flex-col gap-4 overflow-hidden">
          <TelemetryGrid telemetry={telemetry} />
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
            <div className="md:col-span-2">
              <VisionFeed detections={detections} videoRef={videoRef} />
            </div>
          </div>
        </div>

        {/* Right Panel: Analytics and Insights */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden">
          <InsightPanel 
            insight={insight} 
            isLoading={isAnalyzing} 
            onAnalyze={handleDeepAnalyze} 
          />

          <div className="glass rounded-xl p-5 flex-1 flex flex-col">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 nvidia-bg block rounded-full" />
              Real-time Throughput
            </h2>
            <div className="flex-1 w-full min-h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryHistory}>
                  <defs>
                    <linearGradient id="colorGpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#76b900" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#76b900" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #76b900', color: '#fff' }}
                    itemStyle={{ color: '#76b900' }}
                  />
                  <Area type="monotone" dataKey="gpu" stroke="#76b900" fillOpacity={1} fill="url(#colorGpu)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-gray-900/50 p-2 rounded border border-gray-800">
                <div className="text-[10px] text-gray-500 uppercase mono">Peak Inference</div>
                <div className="text-lg font-bold text-[#76b900] mono">32.4<span className="text-[10px] ml-1">FPS</span></div>
              </div>
              <div className="bg-gray-900/50 p-2 rounded border border-gray-800">
                <div className="text-[10px] text-gray-500 uppercase mono">Data Density</div>
                <div className="text-lg font-bold text-blue-400 mono">HGH<span className="text-[10px] ml-1">VOL</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Log Bar */}
      <footer className="glass h-8 px-4 flex items-center justify-between text-[10px] mono text-gray-500">
        <div className="flex gap-4">
          <span>TX_TIMESTAMP: {new Date().toISOString()}</span>
          <span>LAT: 37.7749 N | LON: 122.4194 W</span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#76b900] animate-pulse" />
          ENCRYPTED LINK SECURE
        </div>
      </footer>
    </div>
  );
};

export default App;
