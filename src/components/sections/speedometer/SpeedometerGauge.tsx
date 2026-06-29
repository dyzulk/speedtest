import React from 'react';
import { FiArrowDown, FiArrowUp } from 'react-icons/fi';
import type { TestStage } from '@/types';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { ANGLE_TICKS } from '@/lib/speedometer';

interface SpeedometerGaugeProps {
  stage: TestStage;
  ticks: number[];
  needleRef: React.RefObject<HTMLDivElement | null>;
  progressArcRef: React.RefObject<SVGCircleElement | null>;
  value: string;
  unit: string;
  smoothProgress: number;
}

export const SpeedometerGauge: React.FC<SpeedometerGaugeProps> = ({
  stage,
  ticks,
  needleRef,
  progressArcRef,
  value,
  unit,
  smoothProgress,
}) => {
  return (
    <div className="gauge-container absolute inset-0 w-full h-full opacity-0 pointer-events-none z-30">
      {/* Track SVG Arc Gauge (Rotated 150deg for symmetric bottom gap) */}
      <svg viewBox="0 0 300 300" className="gauge-svg w-full h-full transform rotate-[150deg]">
        {/* Background Track */}
        <circle
          className="gauge-track-bg"
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
        {/* Active Progress Track */}
        <circle
          ref={progressArcRef}
          className={cn(
            'gauge-track-progress transition-colors duration-700',
            stage === 'upload' ? 'text-muted-foreground' : 'text-primary'
          )}
          cx="150"
          cy="150"
          r="120"
          fill="none"
          stroke="currentColor"
          strokeWidth="14"
          strokeLinecap="butt"
          strokeDasharray="502.65 753.98"
          strokeDashoffset={502.65}
        />
      </svg>

      {/* Speedometer Scale Ticks */}
      {ticks.map((tick, i) => {
        const angle = ANGLE_TICKS[i];
        const angleRad = (angle - 90) * (Math.PI / 180);
        const r = 85;
        const x = 150 + r * Math.cos(angleRad);
        const y = 150 + r * Math.sin(angleRad);

        return (
          <div
            key={tick}
            className="gauge-tick absolute text-muted-foreground font-bold text-[10px] sm:text-xs opacity-0"
            style={{
              left: `${(x / 300) * 100}%`,
              top: `${(y / 300) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {tick}
          </div>
        );
      })}

      {/* Analog Needle (0x0 Pivot at Center) */}
      <div
        ref={needleRef}
        className="gauge-needle absolute top-1/2 left-1/2 w-0 h-0 pointer-events-none flex items-end justify-center z-20 opacity-0"
        style={{ transform: 'rotate(-120deg)' }}
      >
        <div
          className={cn(
            'w-2.5 h-[5.5rem] sm:h-[6.5rem] lg:h-[7.5rem] rounded-full origin-bottom absolute bottom-0 left-1/2 transform -translate-x-1/2 shadow-lg transition-colors duration-700',
            stage === 'upload' ? 'bg-muted-foreground' : 'bg-primary'
          )}
        />
      </div>

      {/* Center Pivot Point */}
      <div
        className={cn(
          'gauge-center absolute top-1/2 left-1/2 -ml-2 -mt-2 w-4 h-4 rounded-full z-30 transition-colors duration-700 opacity-0',
          stage === 'upload' ? 'bg-muted-foreground' : 'bg-foreground'
        )}
      />

      {/* Digital Realtime Speed Display & Progress Bar */}
      <div className="gauge-digital absolute bottom-6 sm:bottom-10 left-0 right-0 flex flex-col items-center justify-center text-center z-10 opacity-0">
        <div className="flex flex-col items-center justify-center">
          <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter font-mono text-foreground leading-none">
            {value}
          </span>
          <span className="text-xs sm:text-sm font-bold text-muted-foreground font-mono uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
            {stage === 'download' && <FiArrowDown className="w-3.5 h-3.5 text-primary" />}
            {stage === 'upload' && <FiArrowUp className="w-3.5 h-3.5 text-muted-foreground" />}
            {unit}
          </span>
        </div>

        <div className="w-32 sm:w-40 mt-3">
          <Progress value={smoothProgress} className="h-1.5" />
        </div>
      </div>
    </div>
  );
};
