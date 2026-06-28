import React from 'react';
import { formatSpeed } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FiWifi, FiPlay, FiRefreshCw, FiZap } from 'react-icons/fi';
import { motion } from 'motion/react';
import type { TestStage } from '@/hooks/useSpeedtest';

interface SpeedometerSectionProps {
  speed: number; // in bps
  stage: TestStage;
  progress: number;
  error: string | null;
  onStart: () => void;
  onReset: () => void;
}

export const SpeedometerSection: React.FC<SpeedometerSectionProps> = ({
  speed,
  stage,
  progress,
  error,
  onStart,
  onReset,
}) => {
  const { value, unit } = formatSpeed(speed);

  const mbps = (speed * 8) / 1000000;
  const normalized = Math.min(Math.max(mbps / 1000, 0), 1);
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

  return (
    <section className="w-full flex flex-col items-center justify-center my-4">
      {/* SVG Arc Gauge */}
      <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto aspect-square flex flex-col items-center justify-center p-4">
        <svg viewBox="0 0 300 300" className="w-full h-full transform -rotate-90">
          <circle
            cx="150"
            cy="150"
            r="120"
            fill="none"
            stroke="var(--border)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="565"
            strokeDashoffset="250"
          />
          <circle
            cx="150"
            cy="150"
            r="120"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="502"
            strokeDashoffset={502 - (502 * Math.max(progress, stage === 'idle' ? 0 : 5)) / 100}
          />
        </svg>

        {/* Pointer Needle with Spring Physics Animation */}
        <motion.div
          animate={{ rotate: angle }}
          transition={{ type: 'spring', stiffness: 65, damping: 14 }}
          className="absolute w-full h-full pointer-events-none flex items-center justify-center origin-center"
        >
          <div className="w-1.5 h-24 sm:h-28 lg:h-32 bg-primary rounded-full origin-bottom transform -translate-y-12 shadow-md" />
        </motion.div>

        {/* Center Digital Display */}
        <div className="absolute flex flex-col items-center justify-center text-center z-10">
          <div className="flex items-center space-x-2 text-xs sm:text-sm uppercase tracking-wider font-semibold text-muted-foreground mb-1">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FiWifi className="w-4 h-4 text-primary" />
            </motion.div>
            <span>{getStageLabel()}</span>
          </div>

          <div className="flex items-baseline justify-center">
            <span className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight font-mono text-foreground">
              {stage === 'idle' ? '0.0' : value}
            </span>
            <span className="ml-2 text-lg sm:text-xl lg:text-2xl font-bold text-primary font-mono">
              {unit}
            </span>
          </div>

          {stage !== 'idle' && stage !== 'completed' && (
            <div className="w-36 sm:w-48 mt-4">
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons with Motion Micro-Interactions */}
      <div className="mt-4 mb-6 flex items-center space-x-4">
        {stage === 'idle' || stage === 'completed' || stage === 'error' ? (
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Button
              onClick={onStart}
              size="lg"
              className="px-8 py-6 text-base font-bold rounded-xl shadow-lg cursor-pointer"
            >
              <FiPlay className="w-5 h-5 mr-2 fill-current" />
              <span>{stage === 'completed' ? 'Test Again' : 'Start Speedtest'}</span>
            </Button>
          </motion.div>
        ) : (
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Button
              onClick={onReset}
              variant="outline"
              size="lg"
              className="px-6 py-6 text-sm font-semibold rounded-xl cursor-pointer"
            >
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}>
                <FiRefreshCw className="w-4 h-4 mr-2" />
              </motion.div>
              <span>Cancel Test</span>
            </Button>
          </motion.div>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs sm:text-sm font-mono flex items-center space-x-2 max-w-md text-center"
        >
          <FiZap className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}
    </section>
  );
};
