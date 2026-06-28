import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FiPlay, FiRefreshCw, FiZap, FiArrowDown, FiArrowUp } from 'react-icons/fi';
import type { TestStage } from '@/types';
import { formatSpeed, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useRealtimeValue } from '@/hooks/useRealtimeValue';
import { useSettings } from '@/contexts/SettingsContext';

interface SpeedometerSectionProps {
  speed: number; // in bps
  stage: TestStage;
  progress: number;
  error: string | null;
  onStart: () => void;
  onReset: () => void;
}

export function getSpeedTicks(scale: number) {
  if (scale === 100) return [0, 1, 5, 10, 25, 50, 75, 90, 100];
  if (scale === 500) return [0, 5, 10, 50, 100, 250, 350, 450, 500];
  return [0, 5, 10, 50, 100, 250, 500, 750, 1000];
}

const ANGLE_TICKS = [-120, -90, -60, -30, 0, 30, 60, 90, 120];

export function getSpeedAngle(speed: number, ticks: number[]) {
  if (speed <= 0) return ANGLE_TICKS[0];
  if (speed >= ticks[ticks.length - 1]) return ANGLE_TICKS[ANGLE_TICKS.length - 1];
  
  for (let i = 0; i < ticks.length - 1; i++) {
    if (speed >= ticks[i] && speed <= ticks[i+1]) {
      const range = ticks[i+1] - ticks[i];
      const progress = (speed - ticks[i]) / range;
      const angleRange = ANGLE_TICKS[i+1] - ANGLE_TICKS[i];
      return ANGLE_TICKS[i] + (progress * angleRange);
    }
  }
  return ANGLE_TICKS[0];
}

export const SpeedometerSection: React.FC<SpeedometerSectionProps> = ({
  speed,
  stage,
  progress,
  error,
  onStart,
  onReset,
}) => {
  const { scale, unit: settingsUnit } = useSettings();
  const ticks = getSpeedTicks(scale);

  // Gunakan hook realtime untuk display kecepatan, agar angkanya terus bergerak (tween & jitter) 
  const { smoothValue: needleSpeed, textValue: digitSpeed } = useRealtimeValue(speed, stage === 'download' || stage === 'upload', 0.02);
  const { value, unit } = formatSpeed(digitSpeed, settingsUnit);

  // Gunakan hook realtime untuk progress bar agar pergerakannya mulus tanpa jitter (0)
  const { smoothValue: smoothProgress } = useRealtimeValue(progress, stage === 'download' || stage === 'upload', 0);

  const needleRef = useRef<HTMLDivElement>(null);
  const progressArcRef = useRef<SVGCircleElement>(null);
  const quickOffsetRef = useRef<((value: number) => void) | null>(null);
  const quickRotateRef = useRef<((value: number) => void) | null>(null);

  // Inisialisasi GSAP quickTo controller untuk arc & jarum
  useEffect(() => {
    if (progressArcRef.current) {
      quickOffsetRef.current = gsap.quickTo(progressArcRef.current, 'strokeDashoffset', {
        duration: 0.6,
        ease: 'power2.out',
      });
    }
    if (needleRef.current) {
      quickRotateRef.current = gsap.quickTo(needleRef.current, 'rotation', {
        duration: 0.8,
        ease: 'back.out(1.7)',
      });
    }
  }, []);

  // Update SVG Arc & Jarum berdasarkan kecepatan (menggunakan needleSpeed agar animasinya mulus 60 FPS)
  useEffect(() => {
    // Kita panggil formatSpeed untuk mendapatkan nilai valuenya dalam unit saat ini, 
    // Tapi karena formatSpeed me-return string berformat, kita hitung manual valuenya untuk speedAngle.
    let val = needleSpeed;
    if (settingsUnit === 'Kbps') val = needleSpeed / 1000;
    else if (settingsUnit === 'Mbps') val = needleSpeed / 1_000_000;
    else if (settingsUnit === 'KBps') val = (needleSpeed / 8) / 1000;
    else if (settingsUnit === 'MBps') val = (needleSpeed / 8) / 1_000_000;

    const targetAngle = getSpeedAngle(val, ticks);
    
    // Konversi targetAngle (-120 ke 120) menjadi fraction progress (0 ke 1)
    const fraction = (targetAngle + 120) / 240;
    // Total path length adalah 502.65 (240 derajat dari 360 derajat circle radius 120)
    const targetOffset = 502.65 - (502.65 * fraction);

    if (quickOffsetRef.current) {
      quickOffsetRef.current(targetOffset);
    } else if (progressArcRef.current) {
      gsap.to(progressArcRef.current, { strokeDashoffset: targetOffset, duration: 0.5 });
    }
    
    if (quickRotateRef.current) {
      quickRotateRef.current(targetAngle);
    } else if (needleRef.current) {
      gsap.to(needleRef.current, { rotation: targetAngle, duration: 0.5 });
    }
  }, [needleSpeed]);

  return (
    <section className="w-full flex flex-col items-center justify-center my-4">
      {/* SVG Arc Gauge */}
      <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto aspect-square flex flex-col items-center justify-center p-4">
        {/* Lingkaran diputar 150deg agar potongannya tepat berada di bawah (simetris) */}
        <svg viewBox="0 0 300 300" className="w-full h-full transform rotate-[150deg]">
          {/* Track Belakang */}
          <circle
            cx="150"
            cy="150"
            r="120"
            fill="none"
            stroke="var(--border)"
            strokeWidth="12"
            strokeLinecap="butt"
            strokeDasharray="502.65 753.98"
            strokeDashoffset="0"
          />
          {/* Track Progress (Kecepatan) */}
          <circle
            ref={progressArcRef}
            cx="150"
            cy="150"
            r="120"
            fill="none"
            stroke="currentColor"
            className={cn(
              "transition-colors duration-700",
              stage === 'upload' ? 'text-muted-foreground' : 'text-primary'
            )}
            strokeWidth="14"
            strokeLinecap="butt"
            strokeDasharray="502.65 753.98"
            strokeDashoffset={502.65}
          />
        </svg>

        {/* Tick Mark Angka */}
        {ticks.map((tick, i) => {
          const angle = ANGLE_TICKS[i];
          // -90 to make 0 degrees point UP
          const angleRad = (angle - 90) * (Math.PI / 180);
          const r = 85; // Radius untuk posisi angka
          const x = 150 + r * Math.cos(angleRad);
          const y = 150 + r * Math.sin(angleRad);
          
          return (
            <div
              key={tick}
              className="absolute text-muted-foreground font-bold text-[10px] sm:text-xs"
              style={{
                left: `${(x / 300) * 100}%`,
                top: `${(y / 300) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {tick}
            </div>
          );
        })}

        {/* Jarum Analog (Needle) */}
        <div
          ref={needleRef}
          className="absolute w-full h-full pointer-events-none flex items-center justify-center origin-center z-20"
          style={{ transform: 'rotate(-120deg)' }}
        >
          {/* Tebal jarum dibuat lebih besar: w-2.5 atau w-3. Posisi bottom pass tepat di poros tengah */}
          <div className={cn(
            "w-2.5 h-[5.5rem] sm:h-[6.5rem] lg:h-[7.5rem] rounded-full origin-bottom transform -translate-y-1/2 shadow-lg transition-colors duration-700",
            stage === 'upload' ? 'bg-muted-foreground' : 'bg-primary'
          )} />
        </div>

        {/* Center Digital Display & Titik Poros */}
        <div className={cn(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full z-30 transition-colors duration-700",
          stage === 'upload' ? 'bg-muted-foreground' : 'bg-foreground'
        )} />
        
        {/* Teks Realtime (Dipindah ke ruang kosong di bawah) */}
        <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 flex flex-col items-center justify-center text-center z-10">
          <div className="flex flex-col items-center justify-center">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter font-mono text-foreground leading-none">
              {stage === 'idle' ? '0.0' : value}
            </span>
            <span className="text-xs sm:text-sm font-bold text-muted-foreground font-mono uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
              {stage === 'download' && <FiArrowDown className="w-3.5 h-3.5 text-primary" />}
              {stage === 'upload' && <FiArrowUp className="w-3.5 h-3.5 text-muted-foreground" />}
              {unit}
            </span>
          </div>

          {stage !== 'idle' && stage !== 'completed' && (
            <div className="w-32 sm:w-40 mt-3">
              <Progress value={smoothProgress} className="h-1.5" />
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


