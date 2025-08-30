import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../lib/db';
import { facebookPosts } from '../../lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('📱 Facebook posts API called:', req.method, req.url);
  
  if (req.method !== 'GET') {
    console.log('❌ Invalid method:', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('🔗 Getting database connection...');
    const db = getDb();
    
    console.log('📊 Querying facebook posts...');
    const activePosts = await db
      .select()
      .from(facebookPosts)
      .where(eq(facebookPosts.isActive, 'true'))
      .orderBy(facebookPosts.sortOrder);

    console.log('📱 Raw facebook posts from DB:', JSON.stringify(activePosts, null, 2));

    const postsArray = activePosts.map(post => ({
      id: post.id,
      embedUrl: post.embedUrl,
      title: post.title,
      description: post.description
    }));

    console.log('✅ Facebook posts query successful, returning:', postsArray.length, 'posts');
    console.log('📱 Final posts array:', JSON.stringify(postsArray, null, 2));

    // Cache for 30 seconds to match the original revalidate time
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=59');
    res.status(200).json(postsArray);

  } catch (error) {
    console.error('❌ Facebook posts API error:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // Return empty array in case of database error
    console.log('⚠️ Returning empty array due to error');
    res.status(200).json([]);
  }
}