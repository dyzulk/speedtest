export type TestStage = 'idle' | 'latency' | 'download' | 'upload' | 'completed' | 'error';

export interface SpeedtestMetrics {
  download: number; // in bps
  upload: number; // in bps
  latency: number; // in ms
  jitter: number; // in ms
  packetLoss: number; // percentage 0-100
  loadedLatencyDownload?: number;
  loadedLatencyUpload?: number;
  loadedJitterDownload?: number;
  loadedJitterUpload?: number;
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
