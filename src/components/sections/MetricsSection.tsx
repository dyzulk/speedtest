import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatSpeed, cn } from '@/lib/utils';
import { FiDownload, FiUpload, FiClock, FiActivity } from 'react-icons/fi';
import type { SpeedtestMetrics, TestStage } from '@/hooks/useSpeedtest';

interface MetricsSectionProps {
  metrics: SpeedtestMetrics;
  stage: TestStage;
}

export const MetricsSection: React.FC<MetricsSectionProps> = ({ metrics, stage }) => {
  const dl = formatSpeed(metrics.download);
  const ul = formatSpeed(metrics.upload);

  const cards = [
    {
      title: 'Download Speed',
      value: stage === 'idle' ? '--' : dl.value,
      unit: dl.unit,
      icon: FiDownload,
      isActive: stage === 'download',
      subtitle: 'Bandwidth to client',
      colorClass: 'text-blue-500',
      bgClass: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Upload Speed',
      value: stage === 'idle' ? '--' : ul.value,
      unit: ul.unit,
      icon: FiUpload,
      isActive: stage === 'upload',
      subtitle: 'Bandwidth from client',
      colorClass: 'text-purple-500',
      bgClass: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Idle Latency',
      value: stage === 'idle' ? '--' : metrics.latency.toFixed(1),
      unit: 'ms',
      icon: FiClock,
      isActive: stage === 'latency',
      subtitle: 'Round trip ping',
      colorClass: 'text-amber-500',
      bgClass: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Jitter',
      value: stage === 'idle' ? '--' : metrics.jitter.toFixed(1),
      unit: 'ms',
      icon: FiActivity,
      isActive: stage === 'latency',
      subtitle: 'Latency variance',
      colorClass: 'text-emerald-500',
      bgClass: 'bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="transition-all duration-300">
            <Card
              className={cn(
                'border-border bg-card shadow-xs hover:border-foreground/20',
                card.isActive && 'ring-2 ring-primary/40 border-primary/50 bg-accent/30'
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-semibold tracking-wider text-muted-foreground uppercase font-sans">
                  {card.title}
                </CardTitle>
                <div className={cn('p-2 rounded-lg border', card.bgClass, card.colorClass)}>
                  <Icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-1.5 mt-1">
                  <span className="text-3xl font-bold tracking-tight font-mono text-foreground">
                    {card.value}
                  </span>
                  <span className={cn('text-xs font-semibold font-mono', card.colorClass)}>
                    {card.unit}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-mono truncate">
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

