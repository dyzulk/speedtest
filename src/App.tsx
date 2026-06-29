import { useEffect, lazy, Suspense } from 'react';
import { saveHistoryRecord } from '@/lib/db';
import { useSpeedtest } from '@/hooks/useSpeedtest';
import { HeaderSection } from '@/components/sections/HeaderSection';
import { SpeedometerSection } from '@/components/sections/SpeedometerSection';
import { MetricsSection } from '@/components/sections/MetricsSection';
import { DiagnosticsSection } from '@/components/sections/DiagnosticsSection';
import { FooterSection } from '@/components/sections/FooterSection';

// Lazy load below-the-fold component to optimize initial load chunking
const HistorySection = lazy(() => import('@/components/sections/HistorySection'));

export function App() {
  const { stage, progress, currentSpeed, metrics, error, startTest } = useSpeedtest();

  // Automatically log completed speedtests to hybrid database
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

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground flex flex-col items-center justify-between p-4 sm:p-6 lg:p-10 relative selection:bg-primary selection:text-primary-foreground">
      {/* Container with Multi-Display Responsiveness */}
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
        <HeaderSection />

        <main className="w-full flex flex-col items-center justify-center">
          <SpeedometerSection
            speed={currentSpeed}
            stage={stage}
            progress={progress}
            error={error}
            onStart={startTest}
          />

          <MetricsSection metrics={metrics} stage={stage} />

          <DiagnosticsSection packetLoss={metrics.packetLoss} />

          <Suspense fallback={<div className="w-full h-48 mt-10 rounded-xl border border-border bg-card/40 animate-pulse flex items-center justify-center text-xs text-muted-foreground font-mono">Loading measurement history...</div>}>
            <HistorySection />
          </Suspense>
        </main>
      </div>

      <FooterSection />
    </div>
  );
}

export default App;
