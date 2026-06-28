import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SiCloudflare } from 'react-icons/si';

export const HeaderSection: React.FC = () => {
  return (
    <header className="w-full flex items-center justify-between py-4 mb-6 sm:mb-8 border-b border-border pb-6">
      <div className="flex items-center space-x-3">
        <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500">
          <SiCloudflare className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>SPEEDTEST</span>
            <Badge variant="outline" className="text-xs font-mono border-primary/40 text-primary bg-primary/5">
              PRO
            </Badge>
          </h1>
          <p className="text-xs text-muted-foreground font-mono">Powered by Cloudflare Edge Measurement API</p>
        </div>
      </div>

      <div className="hidden sm:flex items-center space-x-2 text-xs font-mono px-3.5 py-1.5 rounded-full border border-border bg-card text-card-foreground shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>Node: Operational</span>
      </div>
    </header>
  );
};
