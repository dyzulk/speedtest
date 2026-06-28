import React from 'react';
import { SiCloudflare } from 'react-icons/si';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const HeaderSection: React.FC = () => {
  return (
    <header className={cn("w-full flex items-center justify-between py-4 mb-6 sm:mb-8 border-b border-border/80 pb-6")}>

      <div className="flex items-center space-x-3.5">
        <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 shrink-0">
          <SiCloudflare className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>SPEEDTEST</span>
            <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary bg-primary/5 uppercase px-2 py-0.5 rounded-md">
              PRO
            </Badge>
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">Powered by Cloudflare Edge Measurement API</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center space-x-2 text-xs font-mono px-3 py-1.5 rounded-md border border-border/70 bg-card/60 text-card-foreground shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-muted-foreground">Node: <strong className="text-foreground font-medium">Operational</strong></span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};


