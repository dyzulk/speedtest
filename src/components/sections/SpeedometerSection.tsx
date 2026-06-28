import React from 'react';
import { FiZap } from 'react-icons/fi';
import type { TestStage } from '@/types';
import { cn } from '@/lib/utils';
import { useSpeedometerAnimation } from '@/hooks/useSpeedometerAnimation';
import { StartButton } from './speedometer/StartButton';
import { SpeedometerGauge } from './speedometer/SpeedometerGauge';

interface SpeedometerSectionProps {
  speed: number; // in bps
  stage: TestStage;
  progress: number;
  error: string | null;
  onStart: () => void;
}

export const SpeedometerSection: React.FC<SpeedometerSectionProps> = ({
  speed,
  stage,
  progress,
  error,
  onStart,
}) => {
  const { ticks, needleRef, progressArcRef, value, unit, smoothProgress } =
    useSpeedometerAnimation({ speed, stage, progress });

  const isIdleOrCompleted = stage === 'idle' || stage === 'completed' || stage === 'error';

  return (
    <section className="w-full flex flex-col items-center justify-center my-4">
      <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto aspect-square flex flex-col items-center justify-center p-4">
        {isIdleOrCompleted ? (
          <StartButton stage={stage} onStart={onStart} />
        ) : (
          <SpeedometerGauge
            stage={stage}
            ticks={ticks}
            needleRef={needleRef}
            progressArcRef={progressArcRef}
            value={value}
            unit={unit}
            smoothProgress={smoothProgress}
          />
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
