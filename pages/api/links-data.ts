import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../lib/db';
import { links } from '../../lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get active links
    const activeLinks = await getDb()
      .select()
      .from(links)
      .where(eq(links.isActive, 'true'))
      .orderBy(links.createdAt);

    const linksArray = activeLinks.map(link => ({
      url: link.url,
      title: link.title,
      description: link.description,
      images: link.images ? JSON.parse(link.images) : null
    }));

    // Cache for 30 seconds to match the original revalidate time
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=59');
    res.status(200).json(linksArray);

  } catch (error) {
    console.error('Database error:', error);
    
    // Return empty array in case of database error
    res.status(200).json([]);
  }
}