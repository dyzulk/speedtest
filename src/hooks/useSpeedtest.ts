import { useState, useRef, useCallback, useEffect } from 'react';
import SpeedTest from '@cloudflare/speedtest';

export type TestStage = 'idle' | 'latency' | 'download' | 'upload' | 'completed' | 'error';

export interface SpeedtestMetrics {
  download: number; // in bps
  upload: number; // in bps
  latency: number; // in ms
  jitter: number; // in ms
  packetLoss: number; // percentage 0-100
  loadedLatencyDownload?: number;
  loadedLatencyUpload?: number;
}

export interface SpeedtestState {
  stage: TestStage;
  progress: number; // 0 to 100
  currentSpeed: number; // in bps for real-time gauge
  metrics: SpeedtestMetrics;
  error: string | null;
  clientIp?: string;
  serverLocation?: string;
}

export function useSpeedtest() {
  const [state, setState] = useState<SpeedtestState>({
    stage: 'idle',
    progress: 0,
    currentSpeed: 0,
    metrics: {
      download: 0,
      upload: 0,
      latency: 0,
      jitter: 0,
      packetLoss: 0,
    },
    error: null,
  });

  const engineRef = useRef<SpeedTest | null>(null);

  const stopTest = useCallback(() => {
    if (engineRef.current) {
      try {
        engineRef.current.pause();
      } catch {
        // Ignore abort errors
      }
      engineRef.current = null;
    }
  }, []);

  const startTest = useCallback(() => {
    stopTest();

    setState({
      stage: 'latency',
      progress: 5,
      currentSpeed: 0,
      metrics: {
        download: 0,
        upload: 0,
        latency: 0,
        jitter: 0,
        packetLoss: 0,
      },
      error: null,
    });

    try {
      const engine = new SpeedTest({
        autoStart: true,
        logAimApiUrl: null,
        logMeasurementApiUrl: null,
        turnServerCredsApiUrl: '',
        measurements: [
          { type: 'latency', numPackets: 1 },
          { type: 'download', bytes: 1e5, count: 1, bypassMinDuration: true },
          { type: 'latency', numPackets: 20 },
          { type: 'download', bytes: 1e5, count: 9 },
          { type: 'download', bytes: 1e6, count: 8 },
          { type: 'upload', bytes: 1e5, count: 8 },
          { type: 'upload', bytes: 1e6, count: 6 },
          { type: 'download', bytes: 1e7, count: 6 },
          { type: 'upload', bytes: 1e7, count: 4 },
          { type: 'download', bytes: 25e6, count: 4 },
          { type: 'upload', bytes: 25e6, count: 4 },
        ],
      });

      engineRef.current = engine;

      engine.onPhaseChange = (payload) => {
        const type = payload.measurement?.type;
        let currentStage: TestStage = 'latency';
        let progressVal = 10;

        if (type === 'download') {
          currentStage = 'download';
          progressVal = 35;
        } else if (type === 'upload') {
          currentStage = 'upload';
          progressVal = 70;
        } else if (type === 'latency') {
          currentStage = 'latency';
          progressVal = 15;
        }

        setState((prev) => ({
          ...prev,
          stage: currentStage,
          progress: Math.max(prev.progress, progressVal),
        }));
      };

      engine.onResultsChange = (payload) => {
        const results = engine.results;
        if (!results) return;

        const summary = results.getSummary();
        const type = payload?.type;

        let currentStage: TestStage = 'latency';
        let progressVal = 15;
        let activeSpeed = 0;

        // Try to get the latest raw measurement speed if available
        const rawScores = type && (results as unknown as Record<string, { raw: { bps: number }[] }>)[type]?.raw;
        if (rawScores && rawScores.length > 0) {
          activeSpeed = rawScores[rawScores.length - 1].bps;
        }

        if (type === 'upload' || summary.upload) {
          currentStage = 'upload';
          progressVal = 75 + Math.min(20, (summary.upload ? 15 : 5));
          if (!activeSpeed) activeSpeed = summary.upload || 0;
        } else if (type === 'download' || summary.download) {
          currentStage = 'download';
          progressVal = 35 + Math.min(30, (summary.download ? 20 : 10));
          if (!activeSpeed) activeSpeed = summary.download || 0;
        }

        setState((prev) => ({
          ...prev,
          stage: currentStage,
          progress: Math.max(prev.progress, progressVal),
          currentSpeed: activeSpeed || prev.currentSpeed,
          metrics: {
            download: summary.download ?? prev.metrics.download,
            upload: summary.upload ?? prev.metrics.upload,
            latency: summary.latency ?? prev.metrics.latency,
            jitter: summary.jitter ?? prev.metrics.jitter,
            packetLoss: summary.packetLoss ? summary.packetLoss * 100 : prev.metrics.packetLoss,
          },
        }));
      };

      engine.onFinish = (results) => {
        const summary = results.getSummary();
        setState((prev) => ({
          ...prev,
          stage: 'completed',
          progress: 100,
          currentSpeed: 0,
          metrics: {
            download: summary.download ?? prev.metrics.download,
            upload: summary.upload ?? prev.metrics.upload,
            latency: summary.latency ?? prev.metrics.latency,
            jitter: summary.jitter ?? prev.metrics.jitter,
            packetLoss: summary.packetLoss ? summary.packetLoss * 100 : prev.metrics.packetLoss,
          },
        }));
        engineRef.current = null;
      };

      engine.onError = (err) => {
        setState((prev) => ({
          ...prev,
          stage: 'error',
          error: typeof err === 'string' ? err : 'Speedtest measurement error',
        }));
        engineRef.current = null;
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to initialize speedtest engine';
      setState((prev) => ({
        ...prev,
        stage: 'error',
        error: message,
      }));
    }
  }, [stopTest]);

  const resetTest = useCallback(() => {
    stopTest();
    setState({
      stage: 'idle',
      progress: 0,
      currentSpeed: 0,
      metrics: {
        download: 0,
        upload: 0,
        latency: 0,
        jitter: 0,
        packetLoss: 0,
      },
      error: null,
    });
  }, [stopTest]);

  useEffect(() => {
    return () => {
      stopTest();
    };
  }, [stopTest]);

  return {
    ...state,
    startTest,
    stopTest,
    resetTest,
  };
}
