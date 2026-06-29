import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { TestStage } from '@/types';

interface AnimatedBackgroundProps {
  stage: TestStage;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ stage }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const packets = gsap.utils.toArray<SVGElement>('.data-packet');
    
    // Hentikan animasi sebelumnya agar tidak bertumpuk
    gsap.killTweensOf(packets);

    if (stage === 'idle' || stage === 'completed' || stage === 'error') {
      // Keadaan idle: paket data mengalir sangat lambat ke bawah
      packets.forEach((p) => gsap.set(p, { y: '-10vh' }));
      gsap.to(packets, {
        y: '110vh',
        duration: () => gsap.utils.random(15, 25),
        ease: 'none',
        repeat: -1,
        opacity: 0.2,
        stagger: {
          each: 0.5,
          from: 'random'
        }
      });
    } else if (stage === 'latency' || stage === 'download') {
      // Keadaan download: paket data mengalir cepat ke bawah
      packets.forEach((p) => gsap.set(p, { y: '-10vh' }));
      gsap.to(packets, {
        y: '110vh',
        duration: () => gsap.utils.random(0.5, 1.5),
        ease: 'none',
        repeat: -1,
        opacity: 0.8,
        stagger: {
          each: 0.1,
          from: 'random'
        }
      });
    } else if (stage === 'upload') {
      // Keadaan upload: paket data mengalir cepat ke atas
      packets.forEach((p) => gsap.set(p, { y: '110vh' }));
      gsap.to(packets, {
        y: '-10vh',
        duration: () => gsap.utils.random(0.5, 1.5),
        ease: 'none',
        repeat: -1,
        opacity: 0.8,
        stagger: {
          each: 0.1,
          from: 'random'
        }
      });
    }

  }, { dependencies: [stage], scope: containerRef });

  // Membuat 20 jalur sirkuit vertikal
  const lines = Array.from({ length: 20 });

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-background">
      {/* Base Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-20" aria-hidden="true">
        <defs>
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" className="text-border" />
      </svg>
      
      {/* Animated Data Packets */}
      {lines.map((_, i) => {
        // Posisikan secara horizontal (0% hingga 100%)
        const xPos = `${(i + 1) * 4.5}%`; 
        return (
          <svg key={i} className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
            <line
              className="data-packet text-primary"
              x1={xPos}
              y1="0"
              x2={xPos}
              y2="80"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ transform: 'translateY(-200px)' }}
            />
          </svg>
        );
      })}
      
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
    </div>
  );
};
