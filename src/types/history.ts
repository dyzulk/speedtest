export interface HistoryRecord {
  id?: number;
  timestamp: string;
  download: number; 
  upload: number; 
  latency: number; 
  jitter: number; 
  packetLoss: number;
  serverLocation?: string | null;
  clientIp?: string | null;
}
