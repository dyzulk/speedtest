export interface HistoryRecord {
  id?: number;
  timestamp: string;
  download: number; // in bps
  upload: number; // in bps
  latency: number; // in ms
  jitter: number; // in ms
  packetLoss: number; // percentage
  serverLocation?: string | null;
  clientIp?: string | null;
}
