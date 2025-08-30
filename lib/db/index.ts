import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let db: ReturnType<typeof drizzle>;

export function getDb() {
  if (!db) {
    console.log('🔗 Initializing database connection...');
    
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable is not set');
      throw new Error('DATABASE_URL is not set');
    }
    
    // Log database URL (masked for security)
    const maskedUrl = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':***@');
    console.log('🔗 Connecting to database:', maskedUrl);
    
    try {
      // Clean the DATABASE_URL by removing any surrounding quotes
      const cleanUrl = process.env.DATABASE_URL.replace(/^['"]|['"]$/g, '');
      console.log('🔧 Cleaned DATABASE_URL for connection');
      
      const client = postgres(cleanUrl, {
        onnotice: () => {}, // Suppress notices in production
      });
      db = drizzle(client, { schema });
      console.log('✅ Database connection initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize database connection:', error);
      throw error;
    }
  }
  return db;
}

// For backwards compatibility
export { getDb as db };