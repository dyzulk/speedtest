import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatSpeed, cn } from '@/lib/utils';
import { FiDownload, FiUpload, FiClock, FiActivity } from 'react-icons/fi';
import type { SpeedtestMetrics, TestStage } from '@/types';
import { useRealtimeValue } from '@/hooks/useRealtimeValue';
import { useSettings } from '@/contexts/SettingsContext';

interface MetricsSectionProps {
  metrics: SpeedtestMetrics;
  stage: TestStage;
}

export const MetricsSection: React.FC<MetricsSectionProps> = ({ metrics, stage }) => {
  const activeDownload = metrics.download;
  const activeUpload = metrics.upload;
  const activeLatency = stage === 'upload' ? (metrics.loadedLatencyUpload || metrics.latency) : stage === 'download' ? (metrics.loadedLatencyDownload || metrics.latency) : metrics.latency;
  const activeJitter = stage === 'upload' ? (metrics.loadedJitterUpload || metrics.jitter) : stage === 'download' ? (metrics.loadedJitterDownload || metrics.jitter) : metrics.jitter;

  const { textValue: displayDownload } = useRealtimeValue(activeDownload, stage === 'download', 0.015);
  const { textValue: displayUpload } = useRealtimeValue(activeUpload, stage === 'upload', 0.015);
  const { textValue: displayLatency } = useRealtimeValue(activeLatency, stage !== 'idle', 0);
  const { textValue: displayJitter } = useRealtimeValue(activeJitter, stage !== 'idle', 0);

  const { unit } = useSettings();

  const dl = formatSpeed(displayDownload, unit);
  const ul = formatSpeed(displayUpload, unit);

  const cards = [
    {
      title: 'Download Speed',
      value: stage === 'idle' ? '--' : dl.value,
      unit: dl.unit,
      icon: FiDownload,
      isActive: stage !== 'idle' && stage !== 'completed',
      subtitle: 'Bandwidth to client',
      colorClass: 'text-blue-500',
      bgClass: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Upload Speed',
      value: stage === 'idle' ? '--' : ul.value,
      unit: ul.unit,
      icon: FiUpload,
      isActive: stage !== 'idle' && stage !== 'completed',
      subtitle: 'Bandwidth from client',
      colorClass: 'text-purple-500',
      bgClass: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      title: stage === 'latency' || stage === 'idle' ? 'Idle Latency' : 'Loaded Latency',
      value: stage === 'idle' ? '--' : displayLatency.toFixed(1),
      unit: 'ms',
      icon: FiClock,
      isActive: stage !== 'idle' && stage !== 'completed',
      subtitle: stage === 'latency' || stage === 'idle' ? 'Round trip ping' : 'Ping during test',
      colorClass: 'text-amber-500',
      bgClass: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: stage === 'latency' || stage === 'idle' ? 'Jitter' : 'Loaded Jitter',
      value: stage === 'idle' ? '--' : displayJitter.toFixed(1),
      unit: 'ms',
      icon: FiActivity,
      isActive: stage !== 'idle' && stage !== 'completed',
      subtitle: stage === 'latency' || stage === 'idle' ? 'Latency variance' : 'Variance during test',
      colorClass: 'text-emerald-500',
      bgClass: 'bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 my-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="transition-all duration-300">
            <Card
              className={cn(
                'border-border bg-card shadow-xs hover:border-foreground/20 [--card-spacing:--spacing(4)] sm:[--card-spacing:--spacing(6)]',
                card.isActive && 'ring-2 ring-primary/40 border-primary/50 bg-accent/30'
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-1.5 sm:pb-2 space-y-0">
                <CardTitle className="text-[11px] sm:text-xs font-semibold tracking-wider text-muted-foreground uppercase font-sans truncate mr-1">
                  {card.title}
                </CardTitle>
                <div className={cn('p-1.5 sm:p-2 rounded-lg border shrink-0', card.bgClass, card.colorClass)}>
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-1 sm:space-x-1.5 mt-0.5 sm:mt-1">
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight font-mono text-foreground">
                    {card.value}
                  </span>
                  <span className={cn('text-[11px] sm:text-xs font-semibold font-mono', card.colorClass)}>
                    {card.unit}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 sm:mt-2 font-mono truncate">
                  {card.subtitle}
                </p>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </section>
  );
};

