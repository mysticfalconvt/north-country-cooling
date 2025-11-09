import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let db: ReturnType<typeof drizzle>;

export function getDb() {
  if (!db) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set');
    }
    
    try {
      // Clean the DATABASE_URL by removing any surrounding quotes
      const cleanUrl = process.env.DATABASE_URL.replace(/^['"]|['"]$/g, '');
      
      const client = postgres(cleanUrl, {
        onnotice: () => {}, // Suppress notices in production
      });
      db = drizzle(client, { schema });
    } catch (error) {
      console.error('Failed to initialize database connection:', error);
      throw error;
    }
  }
  return db;
}

// For backwards compatibility
export { getDb as db };