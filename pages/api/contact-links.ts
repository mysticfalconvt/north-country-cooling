import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../lib/db';
import { contactLinks } from '../../lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('📞 Contact links API called:', req.method, req.url);
  
  if (req.method !== 'GET') {
    console.log('❌ Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔗 Getting database connection...');
    const db = getDb();
    
    console.log('📊 Querying contact links...');
    const activeContactLinks = await db
      .select()
      .from(contactLinks)
      .where(eq(contactLinks.isActive, 'true'))
      .orderBy(contactLinks.sortOrder, contactLinks.createdAt);

    console.log('📞 Raw contact links from DB:', JSON.stringify(activeContactLinks, null, 2));
    console.log('✅ Contact links query successful, found:', activeContactLinks.length, 'links');

    return res.status(200).json(activeContactLinks);
  } catch (error) {
    console.error('❌ Contact links API error:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return res.status(500).json({ error: 'Internal server error' });
  }
}