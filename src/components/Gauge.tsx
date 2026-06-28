import React from 'react';
import { formatSpeed } from '@/lib/utils';
import { FiWifi } from 'react-icons/fi';

interface GaugeProps {
  speed: number; // in bps
  stage: 'idle' | 'latency' | 'download' | 'upload' | 'completed' | 'error';
  progress: number;
}

export const Gauge: React.FC<GaugeProps> = ({ speed, stage, progress }) => {
  const { value, unit } = formatSpeed(speed);
  
  // Calculate gauge rotation angle (from -120 to +120 degrees)
  const mbps = (speed * 8) / 1000000;
  // Logarithmic-like scaling for better visual feedback across speeds 0 - 1000 Mbps
  const maxScaleMbps = 1000;
  const normalized = Math.min(Math.max(mbps / maxScaleMbps, 0), 1);
  // Apply non-linear curve for low-range visibility
  const curvedProgress = Math.pow(normalized, 0.5);
  const angle = -120 + curvedProgress * 240;

  const getStageLabel = () => {
    switch (stage) {
      case 'latency':
        return 'Measuring Ping & Jitter...';
      case 'download':
        return 'Measuring Download Speed...';
      case 'upload':
        return 'Measuring Upload Speed...';
      case 'completed':
        return 'Test Completed';
      case 'error':
        return 'Measurement Error';
      default:
        return 'Ready to Start';
    }
  };

  const getStageColor = () => {
    switch (stage) {
      case 'download':
        return 'from-blue-500 to-cyan-400';
      case 'upload':
        return 'from-purple-500 to-pink-500';
      case 'completed':
        return 'from-emerald-400 to-teal-500';
      case 'error':
        return 'from-red-500 to-rose-400';
      default:
        return 'from-indigo-500 to-blue-600';
    }
  };

  return (
    <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto aspect-square flex flex-col items-center justify-center p-4">
      {/* Background Glow */}
      <div className={`absolute inset-4 rounded-full bg-gradient-to-tr ${getStageColor()} opacity-20 blur-3xl transition-all duration-700 animate-pulse-glow`} />

      {/* SVG Arc Gauge */}
      <svg viewBox="0 0 300 300" className="w-full h-full transform -rotate-90 drop-shadow-2xl">
        {/* Outer track arc */}
        <circle
          cx="150"
          cy="150"
          r="120"
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="565" // 2 * pi * 120 * (240 / 360) = 502 approx, total circumference 753
          strokeDashoffset="250"
        />

        {/* Progress active arc */}
        <circle
          cx="150"
          cy="150"
          r="120"
          fill="none"
          stroke="url(#gauge-gradient)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray="502"
          strokeDashoffset={502 - (502 * Math.max(progress, stage === 'idle' ? 0 : 5)) / 100}
          className="transition-all duration-500 ease-out"
        />

        <defs>
          <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={stage === 'upload' ? '#a855f7' : '#3b82f6'} />
            <stop offset="100%" stopColor={stage === 'upload' ? '#ec4899' : '#06b6d4'} />
          </linearGradient>
        </defs>
      </svg>

      {/* Pointer Needle */}
      <div
        className="absolute w-full h-full pointer-events-none flex items-center justify-center transition-transform duration-300 ease-out"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <div className="w-1.5 h-24 sm:h-28 lg:h-32 bg-gradient-to-t from-white to-transparent rounded-full origin-bottom transform -translate-y-12 shadow-lg" />
      </div>

      {/* Center Digital Display */}
      <div className="absolute flex flex-col items-center justify-center text-center z-10">
        <div className="flex items-center space-x-2 text-xs sm:text-sm uppercase tracking-wider font-semibold text-slate-400 mb-1">
          <FiWifi className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>{getStageLabel()}</span>
        </div>

        <div className="flex items-baseline justify-center">
          <span className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400 font-mono">
            {stage === 'idle' ? '0.0' : value}
          </span>
          <span className="ml-2 text-lg sm:text-xl lg:text-2xl font-bold text-indigo-400 font-mono">
            {unit}
          </span>
        </div>

        {/* Progress Bar under gauge */}
        {stage !== 'idle' && stage !== 'completed' && (
          <div className="w-32 sm:w-48 h-1.5 bg-slate-800/80 rounded-full mt-3 overflow-hidden border border-white/10">
            <div
              className={`h-full bg-gradient-to-r ${getStageColor()} transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
