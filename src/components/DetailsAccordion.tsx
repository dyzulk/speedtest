import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { FiChevronDown, FiGlobe, FiServer, FiShield, FiActivity } from 'react-icons/fi';

interface DetailsAccordionProps {
  clientIp?: string;
  serverLocation?: string;
  packetLoss?: number;
  loadedLatencyDownload?: number;
  loadedLatencyUpload?: number;
}

export const DetailsAccordion: React.FC<DetailsAccordionProps> = ({
  clientIp = 'Auto-Detected',
  serverLocation = 'Cloudflare Edge (Nearest Anycast)',
  packetLoss = 0,
}) => {
  return (
    <Accordion.Root
      type="single"
      collapsible
      className="w-full max-w-4xl mx-auto mt-6 rounded-2xl glass-card overflow-hidden border border-white/5"
    >
      <Accordion.Item value="diagnostic-details" className="border-b border-white/5 last:border-b-0">
        <Accordion.Trigger className="w-full flex items-center justify-between px-6 py-4 text-left font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all group">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <FiActivity className="w-4 h-4" />
            </div>
            <span className="text-sm sm:text-base font-semibold">Detailed Diagnostic & Connection Telemetry</span>
          </div>
          <FiChevronDown className="w-5 h-5 text-slate-400 transition-transform duration-300 group-data-[state=open]:rotate-180" />
        </Accordion.Trigger>

        <Accordion.Content className="px-6 py-5 bg-slate-950/40 text-sm text-slate-300 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/5 font-mono">
          <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/50 border border-white/5">
            <FiGlobe className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-slate-400 font-sans uppercase font-semibold">Client IP & ISP</p>
              <p className="text-sm font-bold text-white mt-1">{clientIp}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/50 border border-white/5">
            <FiServer className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-slate-400 font-sans uppercase font-semibold">Measurement Node</p>
              <p className="text-sm font-bold text-white mt-1">{serverLocation}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/50 border border-white/5">
            <FiShield className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-slate-400 font-sans uppercase font-semibold">Packet Loss</p>
              <p className="text-sm font-bold text-white mt-1">{packetLoss.toFixed(1)}%</p>
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};
