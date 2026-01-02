
export interface Detection {
  id: string;
  label: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x, y, w, h]
  timestamp: number;
}

export interface DeviceTelemetry {
  gpuUsage: number;
  cpuUsage: number;
  ramUsage: number;
  temp: number;
  fps: number;
  status: 'online' | 'offline' | 'busy';
}

export interface DataFootprint {
  id: string;
  path: { x: number; y: number }[];
  label: string;
  startTime: number;
}

export interface SceneInsight {
  summary: string;
  anomalies: string[];
  recommendations: string;
}
