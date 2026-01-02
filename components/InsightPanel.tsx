
import React from 'react';
import { SceneInsight } from '../types';

interface Props {
  insight: SceneInsight | null;
  isLoading: boolean;
  onAnalyze: () => void;
}

const InsightPanel: React.FC<Props> = ({ insight, isLoading, onAnalyze }) => {
  return (
    <div className="glass rounded-xl p-5 flex flex-col h-full border-l-4 border-l-[#76b900]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <svg className="w-5 h-5 text-[#76b900]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.364-6.364l-.707-.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Gemini Vision Intelligence
        </h2>
        <button 
          onClick={onAnalyze}
          disabled={isLoading}
          className="bg-[#76b900] hover:bg-[#86d100] disabled:bg-gray-700 text-black text-xs font-bold py-1 px-4 rounded transition-colors uppercase tracking-wider"
        >
          {isLoading ? 'Processing...' : 'Recalculate Insight'}
        </button>
      </div>

      {!insight && !isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-sm text-center">
          <p>Initialize deep reasoning to analyze complex scene dynamics beyond simple object detection.</p>
        </div>
      ) : isLoading ? (
        <div className="flex-1 space-y-4">
          <div className="h-4 bg-gray-800 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-800 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-800 rounded w-1/2 animate-pulse"></div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          <section>
            <h3 className="text-[#76b900] text-xs font-bold uppercase mb-1">Semantic Summary</h3>
            <p className="text-sm leading-relaxed text-gray-300">{insight?.summary}</p>
          </section>

          <section>
            <h3 className="text-orange-400 text-xs font-bold uppercase mb-1">Detected Anomalies</h3>
            <ul className="list-disc list-inside space-y-1">
              {insight?.anomalies.map((item, i) => (
                <li key={i} className="text-sm text-gray-300">{item}</li>
              ))}
            </ul>
          </section>

          <section className="bg-[#76b900]/10 p-3 rounded border border-[#76b900]/30">
            <h3 className="text-[#76b900] text-xs font-bold uppercase mb-1">Actionable Intelligence</h3>
            <p className="text-sm text-gray-300 italic">"{insight?.recommendations}"</p>
          </section>
        </div>
      )}
    </div>
  );
};

export default InsightPanel;
