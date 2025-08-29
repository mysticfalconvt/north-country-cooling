import { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../../lib/middleware';
import { getDb } from '../../../../lib/db';
import { facebookPosts } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  const postId = parseInt(id);

  if (req.method === 'DELETE') {
    try {
      await getDb().delete(facebookPosts).where(eq(facebookPosts.id, postId));
      res.status(200).json({ message: 'Facebook post deleted successfully' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { embedUrl, title, description, isActive } = req.body;

      await getDb()
        .update(facebookPosts)
        .set({ 
          embedUrl, 
          title: title || null,
          description: description || null,
          isActive: isActive || 'true',
          updatedAt: new Date()
        })
        .where(eq(facebookPosts.id, postId));

      res.status(200).json({ message: 'Facebook post updated successfully' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export default requireAuth(handler);