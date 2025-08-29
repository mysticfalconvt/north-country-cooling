import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let db: ReturnType<typeof drizzle>;

export function getDb() {
  if (!db) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set');
    }
    const client = postgres(process.env.DATABASE_URL);
    db = drizzle(client, { schema });
  }
  return db;
}

// For backwards compatibility
export { getDb as db };