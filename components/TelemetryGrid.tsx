
import React from 'react';
import { DeviceTelemetry } from '../types';

interface Props {
  telemetry: DeviceTelemetry;
}

const TelemetryGrid: React.FC<Props> = ({ telemetry }) => {
  const MetricCard = ({ label, value, unit, colorClass }: { label: string, value: number, unit: string, colorClass: string }) => (
    <div className="glass p-3 rounded-lg flex flex-col items-center justify-center">
      <span className="text-xs uppercase text-gray-400 mb-1">{label}</span>
      <div className="flex items-baseline">
        <span className={`text-2xl font-bold mono ${colorClass}`}>{value.toFixed(1)}</span>
        <span className="text-xs ml-1 text-gray-500">{unit}</span>
      </div>
      <div className="w-full h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
        <div 
          className={`h-full ${colorClass.replace('text-', 'bg-')} transition-all duration-500`} 
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      <MetricCard label="GPU Core" value={telemetry.gpuUsage} unit="%" colorClass="text-[#76b900]" />
      <MetricCard label="CPU Cluster" value={telemetry.cpuUsage} unit="%" colorClass="text-blue-400" />
      <MetricCard label="Memory" value={telemetry.ramUsage} unit="GB" colorClass="text-purple-400" />
      <MetricCard label="Temperature" value={telemetry.temp} unit="°C" colorClass="text-orange-400" />
      <MetricCard label="Inference" value={telemetry.fps} unit="FPS" colorClass="text-yellow-400" />
    </div>
  );
};

export default TelemetryGrid;
