'use client';

import { useState, useEffect } from 'react';
import { PerformanceTimer } from '@/types/performance';

export default function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceTimer>({
    stt: 0,
    api: 0,
    tts: 0,
    total: 0
  });

  const [targetMet, setTargetMet] = useState(false);

  useEffect(() => {
    // Listen for performance metrics from the VoiceChat component
    const handleMetricsUpdate = (event: CustomEvent<PerformanceTimer>) => {
      const newMetrics = event.detail;
      setMetrics(newMetrics);
      
      // Check if we meet the target of < 1.2s
      setTargetMet(newMetrics.total < 1200);
    };

    window.addEventListener('performance-metrics-update', handleMetricsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('performance-metrics-update', handleMetricsUpdate as EventListener);
    };
  }, []);

  const formatTime = (ms: number) => `${ms.toFixed(0)}ms`;

  const getColorClass = (value: number, target: number) => {
    if (value <= target) return 'text-green-600';
    if (value <= target * 1.2) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Performance Metrics
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Speech-to-Text</div>
          <div className={`text-2xl font-bold ${getColorClass(metrics.stt, 300)}`}>
            {formatTime(metrics.stt)}
          </div>
          <div className="text-xs text-gray-500">Target: &lt;300ms</div>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">OpenAI API</div>
          <div className={`text-2xl font-bold ${getColorClass(metrics.api, 800)}`}>
            {formatTime(metrics.api)}
          </div>
          <div className="text-xs text-gray-500">Target: &lt;800ms</div>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Text-to-Speech</div>
          <div className={`text-2xl font-bold ${getColorClass(metrics.tts, 200)}`}>
            {formatTime(metrics.tts)}
          </div>
          <div className="text-xs text-gray-500">Target: &lt;200ms</div>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Total Response</div>
          <div className={`text-2xl font-bold ${getColorClass(metrics.total, 1200)}`}>
            {formatTime(metrics.total)}
          </div>
          <div className="text-xs text-gray-500">Target: &lt;1.2s</div>
        </div>
      </div>

      {metrics.total > 0 && (
        <div className={`text-center p-4 rounded-lg ${
          targetMet ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <div className="font-semibold">
            {targetMet ? '✅ Target Met!' : '❌ Target Not Met'}
          </div>
          <div className="text-sm">
            {targetMet 
              ? `Response time of ${formatTime(metrics.total)} is under the 1.2s target`
              : `Response time of ${formatTime(metrics.total)} exceeds the 1.2s target`
            }
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <h3 className="font-semibold mb-2">Performance Targets:</h3>
        <ul className="space-y-1">
          <li>• STT (Whisper WASM): &lt;300ms</li>
          <li>• OpenAI API: &lt;800ms</li>
          <li>• TTS (Local): &lt;200ms</li>
          <li>• Total Response: &lt;1.2s</li>
        </ul>
      </div>
    </div>
  );
} 