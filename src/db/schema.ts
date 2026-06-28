import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const history = sqliteTable('history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  timestamp: text('timestamp').notNull(),
  download: real('download').notNull(),
  upload: real('upload').notNull(),
  latency: real('latency').notNull(),
  jitter: real('jitter').notNull(),
  packetLoss: real('packetLoss').notNull().default(0),
  serverLocation: text('serverLocation'),
  clientIp: text('clientIp'),
});

export type HistorySelect = typeof history.$inferSelect;
export type HistoryInsert = typeof history.$inferInsert;
