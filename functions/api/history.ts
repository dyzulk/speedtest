/// <reference types="@cloudflare/workers-types" />
import { historyService } from '../../src/services/historyService';

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

  try {
    if (method === 'GET') {
      const records = await historyService.getAll(env.DB);
      return new Response(JSON.stringify(records), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (method === 'POST') {
      const data: any = await request.json();
      const record = await historyService.create(env.DB, data);
      return new Response(JSON.stringify(record), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (method === 'DELETE') {
      await historyService.deleteAll(env.DB);
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
