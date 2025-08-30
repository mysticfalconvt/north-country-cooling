import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../lib/db';
import { contactLinks } from '../../lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if DATABASE_URL is available (it won't be during build)
    if (!process.env.DATABASE_URL) {
      return res.status(200).json([]);
    }
    
    const db = getDb();
    
    const activeContactLinks = await db
      .select()
      .from(contactLinks)
      .where(eq(contactLinks.isActive, 'true'))
      .orderBy(contactLinks.sortOrder, contactLinks.createdAt);

    return res.status(200).json(activeContactLinks);
  } catch (error) {
    console.error('Contact links API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}