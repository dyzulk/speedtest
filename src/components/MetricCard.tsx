import React from 'react';
import type { IconType } from 'react-icons';
import { cn } from '../lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: IconType;
  colorVariant?: 'blue' | 'purple' | 'amber' | 'emerald' | 'rose';
  isActive?: boolean;
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  colorVariant = 'blue',
  isActive = false,
  subtitle,
}) => {
  const getVariantStyles = () => {
    switch (colorVariant) {
      case 'purple':
        return {
          border: 'border-purple-500/30',
          iconBg: 'bg-purple-500/10 text-purple-400',
          activeGlow: 'glow-upload border-purple-500/60 ring-2 ring-purple-500/20',
          textAccent: 'text-purple-400',
        };
      case 'amber':
        return {
          border: 'border-amber-500/30',
          iconBg: 'bg-amber-500/10 text-amber-400',
          activeGlow: 'border-amber-500/60 ring-2 ring-amber-500/20',
          textAccent: 'text-amber-400',
        };
      case 'emerald':
        return {
          border: 'border-emerald-500/30',
          iconBg: 'bg-emerald-500/10 text-emerald-400',
          activeGlow: 'border-emerald-500/60 ring-2 ring-emerald-500/20',
          textAccent: 'text-emerald-400',
        };
      case 'rose':
        return {
          border: 'border-rose-500/30',
          iconBg: 'bg-rose-500/10 text-rose-400',
          activeGlow: 'border-rose-500/60 ring-2 ring-rose-500/20',
          textAccent: 'text-rose-400',
        };
      default:
        return {
          border: 'border-blue-500/30',
          iconBg: 'bg-blue-500/10 text-blue-400',
          activeGlow: 'glow-download border-blue-500/60 ring-2 ring-blue-500/20',
          textAccent: 'text-blue-400',
        };
    };
  };

  const styles = getVariantStyles();

  return (
    <div
      className={cn(
        'glass-card rounded-2xl p-4 sm:p-5 lg:p-6 transition-all duration-300 relative overflow-hidden group',
        styles.border,
        isActive ? styles.activeGlow : 'hover:border-slate-700 hover:bg-slate-800/40'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs sm:text-sm font-medium text-slate-400 tracking-wide uppercase">
          {title}
        </span>
        <div className={cn('p-2.5 rounded-xl transition-transform group-hover:scale-110', styles.iconBg)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline space-x-1.5">
        <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-mono">
          {value}
        </span>
        <span className={cn('text-xs sm:text-sm font-semibold font-mono', styles.textAccent)}>
          {unit}
        </span>
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 mt-2 font-mono truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
};
