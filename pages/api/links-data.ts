import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../lib/db';
import { links } from '../../lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🔗 Links-data API called:', req.method, req.url);
  
  if (req.method !== 'GET') {
    console.log('❌ Invalid method:', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('🔗 Getting database connection...');
    const db = getDb();
    
    console.log('📊 Querying active links...');
    const activeLinks = await db
      .select()
      .from(links)
      .where(eq(links.isActive, 'true'))
      .orderBy(links.createdAt);

    console.log('🔗 Raw active links from DB:', JSON.stringify(activeLinks, null, 2));

    const linksArray = activeLinks.map(link => ({
      url: link.url,
      title: link.title,
      description: link.description,
      images: link.images ? JSON.parse(link.images) : null
    }));

    console.log('✅ Links-data query successful, returning:', linksArray.length, 'links');
    console.log('🔗 Final links array:', JSON.stringify(linksArray, null, 2));

    // Cache for 30 seconds to match the original revalidate time
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=59');
    res.status(200).json(linksArray);

  } catch (error) {
    console.error('❌ Links-data API error:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // Return empty array in case of database error
    console.log('⚠️ Returning empty array due to error');
    res.status(200).json([]);
  }
}