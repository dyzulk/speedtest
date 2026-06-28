import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { FiZap } from 'react-icons/fi';
import type { TestStage } from '@/types';
import { cn } from '@/lib/utils';
import { useSpeedometerAnimation } from '@/hooks/useSpeedometerAnimation';
import { StartButton } from './speedometer/StartButton';
import { SpeedometerGauge } from './speedometer/SpeedometerGauge';

gsap.registerPlugin(useGSAP);

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
  const containerRef = useRef<HTMLDivElement>(null);

  const { ticks, needleRef, progressArcRef, value, unit, smoothProgress } =
    useSpeedometerAnimation({ speed, stage, progress });

  const isTesting = stage === 'download' || stage === 'upload';

  // GSAP Choreographed Transition
  useGSAP(() => {
    const tl = gsap.timeline();

    if (isTesting) {
      // --- Transition IN: Speedometer Gauge ---
      tl.set('.gauge-container', { display: 'block' });
      tl.to('.start-btn-container', { pointerEvents: 'none', duration: 0 });
      tl.to('.radar-ring', { scale: 0.8, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, 0);
      tl.to('.start-btn-gradient', { scale: 0.5, autoAlpha: 0, duration: 0.5, ease: 'back.in(1.2)' }, 0);
      tl.set('.start-btn-container', { display: 'none' }); // completely hide to prevent CSS keyframe flashes

      tl.to('.gauge-container', { opacity: 1, pointerEvents: 'auto', duration: 0.1 }, 0.4);

      // Draw background track
      tl.fromTo('.gauge-track-bg',
        { strokeDashoffset: 502.65 },
        { strokeDashoffset: 0, duration: 1.2, ease: 'power3.out' }, 0.4
      );

      // Pop center pivot
      tl.fromTo('.gauge-center',
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, 0.6
      );

      // Stagger ticks
      tl.fromTo('.gauge-tick',
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.04, ease: 'back.out(2)' }, 0.6
      );

      // Slide & fade digital display
      tl.fromTo('.gauge-digital',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.8
      );

      // Fade in needle
      tl.to('.gauge-needle', { opacity: 1, duration: 0.3 }, 1.0);

    } else {
      // --- Transition OUT: Back to StartButton ---
      tl.to('.gauge-container', { opacity: 0, pointerEvents: 'none', duration: 0.4 }, 0);
      tl.set('.gauge-container', { display: 'none' });

      tl.set('.start-btn-container', { display: 'flex', pointerEvents: 'auto' }, 0);

      tl.fromTo('.start-btn-gradient',
        { scale: 0.5, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'back.out(1.5)' }, 0.2
      );
      tl.fromTo('.radar-ring',
        { scale: 0.8, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, 0.3
      );
    }
  }, { dependencies: [isTesting], scope: containerRef });

  return (
    <section className="w-full flex flex-col items-center justify-center my-4">
      <div 
        ref={containerRef} 
        className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto aspect-square flex flex-col items-center justify-center p-4"
      >
        {/* Render BOTH components absolutely. GSAP handles their visibility seamlessly. */}
        <StartButton stage={stage} onStart={onStart} />
        
        <SpeedometerGauge
          stage={stage}
          ticks={ticks}
          needleRef={needleRef}
          progressArcRef={progressArcRef}
          value={value}
          unit={unit}
          smoothProgress={smoothProgress}
        />
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
