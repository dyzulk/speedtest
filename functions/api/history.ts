/// <reference types="@cloudflare/workers-types" />
import { drizzle } from 'drizzle-orm/d1';
import { history } from '@/db/schema';
import { desc } from 'drizzle-orm';

interface Env {
  DB?: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const method = request.method;

  if (!env.DB) {
    if (method === 'GET') {
      return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(
      JSON.stringify({ success: false, message: 'Cloudflare D1 binding not found' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const db = drizzle(env.DB);

  try {
    // Ensure table exists on D1 / Miniflare SQLite
    await env.DB.prepare(
      `CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        download REAL NOT NULL,
        upload REAL NOT NULL,
        latency REAL NOT NULL,
        jitter REAL NOT NULL,
        packetLoss REAL NOT NULL DEFAULT 0,
        serverLocation TEXT,
        clientIp TEXT
      )`
    ).run();

    if (method === 'GET') {
      const records = await db
        .select()
        .from(history)
        .orderBy(desc(history.timestamp))
        .limit(50);
      return new Response(JSON.stringify(records), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (method === 'POST') {
      const data: any = await request.json();
      const newRecord = await db.insert(history).values({
        timestamp: data.timestamp || new Date().toISOString(),
        download: data.download || 0,
        upload: data.upload || 0,
        latency: data.latency || 0,
        jitter: data.jitter || 0,
        packetLoss: data.packetLoss || 0,
        serverLocation: data.serverLocation || 'Cloudflare Edge',
        clientIp: data.clientIp || '127.0.0.1',
      }).returning();

      return new Response(JSON.stringify(newRecord[0] || { success: true }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (method === 'DELETE') {
      await db.delete(history);
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
};
