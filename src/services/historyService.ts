/// <reference types="@cloudflare/workers-types" />
import { desc } from 'drizzle-orm';
import { getDb } from '../db/client';
import { history, type HistoryInsert } from '../db/schema';

export const historyService = {
  async getAll(envDb: D1Database, limit = 50) {
    const db = getDb(envDb);
    return await db
      .select()
      .from(history)
      .orderBy(desc(history.timestamp))
      .limit(limit);
  },

  async create(envDb: D1Database, data: Partial<HistoryInsert>) {
    const db = getDb(envDb);
    const newRecord = await db
      .insert(history)
      .values({
        timestamp: data.timestamp || new Date().toISOString(),
        download: data.download || 0,
        upload: data.upload || 0,
        latency: data.latency || 0,
        jitter: data.jitter || 0,
        packetLoss: data.packetLoss || 0,
        serverLocation: data.serverLocation || 'Cloudflare Edge',
        clientIp: data.clientIp || '127.0.0.1',
      })
      .returning();

    return newRecord[0] || { success: true };
  },

  async deleteAll(envDb: D1Database) {
    const db = getDb(envDb);
    return await db.delete(history);
  },
};
