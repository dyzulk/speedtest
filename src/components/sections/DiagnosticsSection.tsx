import React from 'react';
import { FiGlobe, FiServer, FiShield, FiActivity, FiWifi } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

interface DiagnosticsSectionProps {
  clientIp?: string;
  serverLocation?: string;
  packetLoss?: number;
}

export const DiagnosticsSection: React.FC<DiagnosticsSectionProps> = ({
  clientIp = 'Auto-Detected',
  serverLocation = 'Cloudflare Edge Network',
  packetLoss = 0,
}) => {
  const connection = (navigator as any).connection;
  const connectionType = connection?.type || connection?.effectiveType || 'Unknown';
  return (
    <section className={cn("w-full max-w-4xl mx-auto mt-6")}>

      <Accordion type="single" collapsible className="w-full rounded-xl border border-border bg-card shadow-xs">
        <AccordionItem value="diagnostic-details" className="border-b-0">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-accent/50 transition-all">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <FiActivity className="w-4 h-4" />
              </div>
              <span className="text-sm sm:text-base font-semibold text-foreground">Detailed Connection Diagnostics</span>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-6 py-5 bg-muted/30 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-border font-mono">
            <div className="flex items-start space-x-3 p-3.5 rounded-lg bg-card border border-border">
              <FiGlobe className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground font-sans uppercase font-semibold">Client IP</p>
                <p className="text-sm font-bold text-foreground mt-1">{clientIp}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3.5 rounded-lg bg-card border border-border">
              <FiServer className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground font-sans uppercase font-semibold">Measurement Node</p>
                <p className="text-sm font-bold text-foreground mt-1">{serverLocation}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3.5 rounded-lg bg-card border border-border">
              <FiShield className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground font-sans uppercase font-semibold">Packet Loss</p>
                <p className="text-sm font-bold text-foreground mt-1">{packetLoss.toFixed(1)}%</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3.5 rounded-lg bg-card border border-border">
              <FiWifi className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground font-sans uppercase font-semibold">Connection</p>
                <p className="text-sm font-bold text-foreground mt-1 capitalize">{connectionType}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};
