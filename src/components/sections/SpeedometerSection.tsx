import React, { useEffect, useRef } from 'react';
import { formatSpeed } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FiWifi, FiPlay, FiRefreshCw, FiZap } from 'react-icons/fi';
import gsap from 'gsap';
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

  const needleRef = useRef<HTMLDivElement>(null);
  const progressArcRef = useRef<SVGCircleElement>(null);
  const quickRotateRef = useRef<((value: number) => void) | null>(null);

  // Inisialisasi GSAP quickTo controller untuk jarum speedometer (High performance imperatif animation)
  useEffect(() => {
    if (needleRef.current) {
      quickRotateRef.current = gsap.quickTo(needleRef.current, 'rotation', {
        duration: 0.8,
        ease: 'back.out(1.7)', // Efek inersia fisika membal (elastic needle overshoot)
      });
    }
  }, []);

  // Update posisi rotasi jarum via GSAP quickTo tanpa memicu re-render React
  useEffect(() => {
    const mbps = (speed * 8) / 1000000;
    const normalized = Math.min(Math.max(mbps / 1000, 0), 1);
    const curvedProgress = Math.pow(normalized, 0.5);
    const targetAngle = -120 + curvedProgress * 240;

    if (quickRotateRef.current) {
      quickRotateRef.current(targetAngle);
    } else if (needleRef.current) {
      gsap.to(needleRef.current, { rotation: targetAngle, duration: 0.5 });
    }
  }, [speed]);

  // Update SVG Arc strokeDashoffset via GSAP tween
  useEffect(() => {
    if (progressArcRef.current) {
      const targetOffset = 502 - (502 * Math.max(progress, stage === 'idle' ? 0 : 5)) / 100;
      gsap.to(progressArcRef.current, {
        strokeDashoffset: targetOffset,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  }, [progress, stage]);

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
            ref={progressArcRef}
            cx="150"
            cy="150"
            r="120"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="502"
            strokeDashoffset={502}
          />
        </svg>

        {/* Pointer Needle dengan Animasi Imperatif GSAP */}
        <div
          ref={needleRef}
          className="absolute w-full h-full pointer-events-none flex items-center justify-center origin-center"
          style={{ transform: 'rotate(-120deg)' }}
        >
          <div className="w-1.5 h-24 sm:h-28 lg:h-32 bg-primary rounded-full origin-bottom transform -translate-y-12 shadow-md" />
        </div>

        {/* Center Digital Display */}
        <div className="absolute flex flex-col items-center justify-center text-center z-10">
          <div className="flex items-center space-x-2 text-xs sm:text-sm uppercase tracking-wider font-semibold text-muted-foreground mb-1">
            <div className="animate-pulse">
              <FiWifi className="w-4 h-4 text-primary" />
            </div>
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

      {/* Action Buttons dengan Standar Shadcn UI & Sera Preset */}
      <div className="mt-4 mb-6 flex items-center space-x-4">
        {stage === 'idle' || stage === 'completed' || stage === 'error' ? (
          <Button
            onClick={onStart}
            size="lg"
            className="px-8 py-6 text-sm font-bold shadow-xs cursor-pointer tracking-wider"
          >
            <FiPlay className="w-4 h-4 mr-2 fill-current" />
            <span>{stage === 'completed' ? 'TEST AGAIN' : 'START SPEEDTEST'}</span>
          </Button>
        ) : (
          <Button
            onClick={onReset}
            variant="outline"
            size="lg"
            className="px-6 py-6 text-xs font-bold shadow-2xs cursor-pointer tracking-wider"
          >
            <div className="animate-spin mr-2">
              <FiRefreshCw className="w-4 h-4" />
            </div>
            <span>CANCEL TEST</span>
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs sm:text-sm font-mono flex items-center space-x-2 max-w-md text-center transition-all duration-300">
          <FiZap className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </section>
  );
};


