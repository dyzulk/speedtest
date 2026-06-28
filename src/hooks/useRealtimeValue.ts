import { useState, useEffect, useRef } from 'react';

/**
 * Hook untuk melakukan interpolasi (smooth tweening) dan menambahkan micro-jitter
 * agar angka telemetri terasa benar-benar "real-time" per frame milidetik.
 * Mengembalikan objek dengan smoothValue (untuk mekanik 60 FPS) dan textValue (di-throttle agar terbaca).
 */
export function useRealtimeValue(
  targetValue: number,
  isActive: boolean,
  jitterRange: number = 0.015, // 1.5% jitter
  textThrottleMs: number = 100 // update teks per 100ms
) {
  const [smoothValue, setSmoothValue] = useState(targetValue);
  const [textValue, setTextValue] = useState(targetValue);
  
  const currentRef = useRef(targetValue);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const lastTextTimeRef = useRef<number>(0);

  useEffect(() => {
    // Snap instan ke 0 jika di-reset
    if (targetValue === 0 && !isActive) {
      currentRef.current = 0;
      setSmoothValue(0);
      setTextValue(0);
      cancelAnimationFrame(frameRef.current);
      return;
    }

    const animate = (time: number) => {
      // Batasi pembaruan ke sekitar 60 FPS
      if (time - lastTimeRef.current < 16) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTimeRef.current = time;

      const diff = targetValue - currentRef.current;
      
      // Interpolasi (Lerp) - semakin besar konstanta, semakin cepat bergeraknya
      currentRef.current = currentRef.current + diff * 0.08;

      let finalValue = currentRef.current;
      
      // Jika dalam mode aktif dan sudah mencapai kecepatan yang stabil, 
      // tambahkan jitter mikro untuk ilusi "real-time streaming"
      if (isActive && targetValue > 0) {
        // Hanya tambahkan jitter jika interpolasi sudah hampir mencapai target (mendekati 80%)
        if (Math.abs(diff) < targetValue * 0.2) {
          const jitter = targetValue * jitterRange * (Math.random() * 2 - 1);
          finalValue += jitter;
        }
      }

      finalValue = Math.max(0, finalValue);

      // Update mekanik secepat 60 FPS
      setSmoothValue(finalValue);
      
      // Update teks dibatasi / throttled
      if (time - lastTextTimeRef.current > textThrottleMs) {
        setTextValue(finalValue);
        lastTextTimeRef.current = time;
      }

      // Terus loop jika masih aktif atau belum mencapai target secara visual
      if (isActive || Math.abs(diff) > 0.5) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setSmoothValue(targetValue);
        setTextValue(targetValue);
        currentRef.current = targetValue;
      }
    };

    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameRef.current);
  }, [targetValue, isActive, jitterRange, textThrottleMs]);

  return { smoothValue, textValue };
}
