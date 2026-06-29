import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import type { TestStage } from '@/types';
import { formatSpeed } from '@/lib/utils';
import { useRealtimeValue } from '@/hooks/useRealtimeValue';
import { useSettings } from '@/contexts/SettingsContext';
import { getSpeedTicks, getSpeedAngle } from '@/lib/speedometer';

interface UseSpeedometerAnimationParams {
  speed: number;
  stage: TestStage;
  progress: number;
}

export function useSpeedometerAnimation({
  speed,
  stage,
  progress,
}: UseSpeedometerAnimationParams) {
  const { scale, unit: settingsUnit } = useSettings();
  const ticks = getSpeedTicks(scale);

  const isMeasuring = stage === 'download' || stage === 'upload';

  // Artificial Transition Pause (800ms) between Download and Upload
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevStageRef = useRef<TestStage>(stage);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (prevStageRef.current === 'download' && stage === 'upload') {
      setIsTransitioning(true);
      timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 800);
    } else {
      setIsTransitioning(false);
    }

    prevStageRef.current = stage;

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [stage]);

  const effectiveSpeed = isTransitioning ? 0 : speed;

  // Realtime values for needle rotation and digital text counter
  const { smoothValue: needleSpeed, textValue: digitSpeed } = useRealtimeValue(effectiveSpeed, isMeasuring, 0.02);
  const { value, unit } = formatSpeed(digitSpeed, settingsUnit);

  // Realtime value for progress bar (smooth without jitter)
  const { smoothValue: smoothProgress } = useRealtimeValue(progress, isMeasuring, 0);

  const needleRef = useRef<HTMLDivElement>(null);
  const progressArcRef = useRef<SVGCircleElement>(null);
  const quickOffsetRef = useRef<((value: number) => void) | null>(null);
  const quickRotateRef = useRef<((value: number) => void) | null>(null);

  // Initialize GSAP quickTo controllers
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

  // Update SVG Arc & Needle rotation based on needleSpeed (60 FPS smooth animation)
  useEffect(() => {
    let val = needleSpeed;
    if (settingsUnit === 'Kbps') val = needleSpeed / 1000;
    else if (settingsUnit === 'Mbps') val = needleSpeed / 1_000_000;
    else if (settingsUnit === 'KBps') val = (needleSpeed / 8) / 1000;
    else if (settingsUnit === 'MBps') val = (needleSpeed / 8) / 1_000_000;

    const targetAngle = getSpeedAngle(val, ticks);
    const fraction = (targetAngle + 120) / 240;
    const targetOffset = 502.65 - 502.65 * fraction;

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
  }, [needleSpeed, settingsUnit, ticks]);

  return {
    ticks,
    needleRef,
    progressArcRef,
    value,
    unit,
    smoothProgress,
  };
}
