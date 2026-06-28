import { useEffect } from 'react';
import { useSpeedtest } from './hooks/useSpeedtest';
import { Gauge } from './components/Gauge';
import { MetricCard } from './components/MetricCard';
import { DetailsAccordion } from './components/DetailsAccordion';
import { HistoryTable } from './components/HistoryTable';
import { formatSpeed } from './lib/utils';
import { saveHistoryRecord } from './lib/db';
import { SiCloudflare } from 'react-icons/si';
import { FiDownload, FiUpload, FiClock, FiActivity, FiPlay, FiRefreshCw, FiZap } from 'react-icons/fi';

export function App() {
  const { stage, progress, currentSpeed, metrics, error, startTest, resetTest } = useSpeedtest();

  // Save history on completion
  useEffect(() => {
    if (stage === 'completed') {
      saveHistoryRecord({
        download: metrics.download,
        upload: metrics.upload,
        latency: metrics.latency,
        jitter: metrics.jitter,
        packetLoss: metrics.packetLoss,
        serverLocation: 'Cloudflare Edge Network',
      });
    }
  }, [stage, metrics]);

  const dl = formatSpeed(metrics.download);
  const ul = formatSpeed(metrics.upload);

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col items-center justify-between p-4 sm:p-6 lg:p-10 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container with Multi-Display Responsiveness */}
      <div className="w-full max-w-7xl mx-auto z-10 flex flex-col items-center">
        {/* Header */}
        <header className="w-full flex items-center justify-between py-4 mb-6 sm:mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-orange-500/20 to-amber-500/20 border border-orange-500/30 text-orange-400">
              <SiCloudflare className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 font-sans">
                <span>SPEEDTEST</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-mono">PRO</span>
              </h1>
              <p className="text-xs text-slate-400 font-mono">Powered by Cloudflare Edge Network</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-xs font-mono px-3.5 py-1.5 rounded-full glass-card border border-white/10 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Node Status: Operational</span>
          </div>
        </header>

        {/* Speedometer Section */}
        <main className="w-full flex flex-col items-center justify-center">
          <Gauge speed={currentSpeed} stage={stage} progress={progress} />

          {/* Action Control Buttons */}
          <div className="mt-6 mb-8 flex items-center space-x-4">
            {stage === 'idle' || stage === 'completed' || stage === 'error' ? (
              <button
                onClick={startTest}
                className="flex items-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
              >
                <FiPlay className="w-5 h-5 fill-current transition-transform group-hover:translate-x-0.5" />
                <span>{stage === 'completed' ? 'Test Again' : 'Start Speedtest'}</span>
              </button>
            ) : (
              <button
                onClick={resetTest}
                className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-300 font-semibold text-sm transition-all cursor-pointer"
              >
                <FiRefreshCw className="w-4 h-4 animate-spin" />
                <span>Cancel Test</span>
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-mono flex items-center space-x-2 max-w-md text-center">
              <FiZap className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Grid of Telemetry Cards */}
          <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-6">
            <MetricCard
              title="Download Speed"
              value={stage === 'idle' ? '--' : dl.value}
              unit={dl.unit}
              icon={FiDownload}
              colorVariant="blue"
              isActive={stage === 'download'}
              subtitle="Bandwidth to client"
            />
            <MetricCard
              title="Upload Speed"
              value={stage === 'idle' ? '--' : ul.value}
              unit={ul.unit}
              icon={FiUpload}
              colorVariant="purple"
              isActive={stage === 'upload'}
              subtitle="Bandwidth from client"
            />
            <MetricCard
              title="Idle Latency"
              value={stage === 'idle' ? '--' : metrics.latency.toFixed(1)}
              unit="ms"
              icon={FiClock}
              colorVariant="amber"
              isActive={stage === 'latency'}
              subtitle="Round trip ping"
            />
            <MetricCard
              title="Jitter"
              value={stage === 'idle' ? '--' : metrics.jitter.toFixed(1)}
              unit="ms"
              icon={FiActivity}
              colorVariant="emerald"
              isActive={stage === 'latency'}
              subtitle="Latency variance"
            />
          </section>

          {/* Radix Accordion Diagnostics */}
          <DetailsAccordion packetLoss={metrics.packetLoss} />

          {/* Radix Tabs History Log */}
          <HistoryTable />
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 text-center text-xs text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>Speedtest Engine powered by Cloudflare Edge Measurement API</p>
        <p>Built with React, Vite, Tailwind CSS v4 & Radix UI</p>
      </footer>
    </div>
  );
}

export default App;
