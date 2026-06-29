import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export const getDb = (envDb: D1Database) => {
  return drizzle(envDb, { schema });
};
