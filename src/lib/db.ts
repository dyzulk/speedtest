import Dexie, { type EntityTable } from 'dexie';

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

const db = new Dexie('SpeedtestHistoryDB') as Dexie & {
  history: EntityTable<HistoryRecord, 'id'>;
};

db.version(1).stores({
  history: '++id, timestamp, download, upload, latency',
});

export async function saveHistoryRecord(record: Omit<HistoryRecord, 'id' | 'timestamp'>): Promise<HistoryRecord> {
  const newRecord: HistoryRecord = {
    ...record,
    timestamp: new Date().toISOString(),
  };

  // 1. Save to local IndexedDB (always succeeds offline)
  const id = await db.history.add(newRecord);
  const savedLocalRecord = { ...newRecord, id };

  // 2. Attempt background sync to Cloudflare D1 API endpoint
  try {
    const response = await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(savedLocalRecord),
    });
    if (response.ok) {
      const serverResult = (await response.json()) as HistoryRecord;
      return serverResult;
    }
  } catch {
    // Gracefully fallback to local storage if running standalone vite dev server
  }

  return savedLocalRecord;
}

export async function getHistoryRecords(): Promise<HistoryRecord[]> {
  // 1. Try fetching from server D1 database API
  try {
    const response = await fetch('/api/history');
    if (response.ok) {
      const serverRecords = (await response.json()) as HistoryRecord[];
      if (Array.isArray(serverRecords) && serverRecords.length > 0) {
        return serverRecords;
      }
    }
  } catch {
    // Fallback silently if offline or running vite dev server
  }

  // 2. Fallback to local IndexedDB records
  const localRecords = await db.history.orderBy('timestamp').reverse().toArray();
  return localRecords;
}

export async function clearHistoryRecords(): Promise<void> {
  await db.history.clear();
  try {
    await fetch('/api/history', { method: 'DELETE' });
  } catch {
    // Ignore offline errors
  }
}

export { db };
