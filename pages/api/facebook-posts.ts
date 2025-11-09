import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../lib/db';
import { facebookPosts } from '../../lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if DATABASE_URL is available (it won't be during build)
    if (!process.env.DATABASE_URL) {
      return res.status(200).json([]);
    }
    
    const db = getDb();
    
    const activePosts = await db
      .select()
      .from(facebookPosts)
      .where(eq(facebookPosts.isActive, 'true'))
      .orderBy(facebookPosts.sortOrder);

    const postsArray = activePosts.map(post => ({
      id: post.id,
      embedUrl: post.embedUrl,
      title: post.title,
      description: post.description
    }));

    // Cache for 30 seconds to match the original revalidate time
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=59');
    res.status(200).json(postsArray);

  } catch (error) {
    console.error('Facebook posts API error:', error);
    
    // Return empty array in case of database error
    res.status(200).json([]);
  }
}