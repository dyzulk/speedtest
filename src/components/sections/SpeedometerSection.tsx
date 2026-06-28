import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FiPlay, FiRefreshCw, FiZap } from 'react-icons/fi';
import type { TestStage } from '@/types';
import { formatSpeed, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useRealtimeValue } from '@/hooks/useRealtimeValue';

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
  // Gunakan hook realtime untuk display kecepatan, agar angkanya terus bergerak (tween & jitter) 
  const displaySpeed = useRealtimeValue(speed, stage === 'download' || stage === 'upload', 0.02);
  const { value, unit } = formatSpeed(displaySpeed);

  const progressArcRef = useRef<SVGCircleElement>(null);
  const quickOffsetRef = useRef<((value: number) => void) | null>(null);

  // Inisialisasi GSAP quickTo controller untuk arc speedometer (High performance imperatif animation)
  useEffect(() => {
    if (progressArcRef.current) {
      quickOffsetRef.current = gsap.quickTo(progressArcRef.current, 'strokeDashoffset', {
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  }, []);

  // Update SVG Arc strokeDashoffset via GSAP quickTo berdasarkan kecepatan
  useEffect(() => {
    const mbps = (speed * 8) / 1000000;
    const normalized = Math.min(Math.max(mbps / 1000, 0), 1);
    const curvedProgress = Math.pow(normalized, 0.5);
    const targetOffset = 502 - (502 * curvedProgress);

    if (quickOffsetRef.current) {
      quickOffsetRef.current(targetOffset);
    } else if (progressArcRef.current) {
      gsap.to(progressArcRef.current, { strokeDashoffset: targetOffset, duration: 0.5 });
    }
  }, [speed]);

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
            strokeLinecap="butt"
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
            strokeLinecap="butt"
            strokeDasharray="502"
            strokeDashoffset={502}
          />
        </svg>

        {/* Center Digital Display */}
        <div className="absolute flex flex-col items-center justify-center text-center z-10 translate-y-4">
          <div className="flex flex-col items-center justify-center">
            <span className="text-5xl sm:text-6xl lg:text-6xl font-extrabold tracking-tighter font-mono text-foreground leading-none">
              {stage === 'idle' ? '0.0' : value}
            </span>
            <span className="mt-2 text-sm sm:text-base font-bold text-muted-foreground font-mono uppercase tracking-wider">
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
          <Button onClick={onStart} size="lg">
            <FiPlay className="mr-2 fill-current" />
            <span>{stage === 'completed' ? 'TEST AGAIN' : 'START SPEEDTEST'}</span>
          </Button>
        ) : (
          <Button onClick={onReset} variant="outline" size="lg">
            <div className="animate-spin mr-2">
              <FiRefreshCw />
            </div>
            <span>CANCEL TEST</span>
          </Button>
        )}
      </div>

      {error && (
        <div className={cn("mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs sm:text-sm font-mono flex items-center space-x-2 max-w-md text-center transition-all duration-300")}>
          <FiZap className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </section>
  );
};


