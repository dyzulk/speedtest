import React from 'react';
import type { TestStage } from '@/types';

interface StartButtonProps {
  stage: TestStage;
  onStart: () => void;
}

export const StartButton: React.FC<StartButtonProps> = ({ stage, onStart }) => {
  return (
    <div className="start-btn-container absolute inset-0 flex items-center justify-center w-full h-full z-40">
      {/* Outer animated radar ring */}
      <div className="radar-ring absolute animate-start-ring w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] rounded-full border-2 border-[#2de5d1]" />

      {/* Gradient Wrapper */}
      <div className="start-btn-gradient relative flex items-center justify-center w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] rounded-full bg-gradient-to-b from-[#2de5d1] to-[#1fa4e9] shadow-xl">
        {/* Actual Button */}
        <button
          onClick={onStart}
          className="w-[176px] h-[176px] sm:w-[216px] sm:h-[216px] rounded-full bg-background hover:bg-muted transition-colors duration-200 flex items-center justify-center text-foreground cursor-pointer z-10"
        >
          <h1 className="text-4xl sm:text-5xl font-medium uppercase tracking-wider text-center font-sans">
            {stage === 'completed' ? 'AGAIN' : 'RUN'}
          </h1>
        </button>
      </div>
    </div>
  );
};
