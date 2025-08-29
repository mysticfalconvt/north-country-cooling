import { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../lib/middleware';
import { getDb } from '../../../lib/db';
import { facebookPosts } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const db = getDb();
      const allPosts = await db.select().from(facebookPosts).orderBy(facebookPosts.sortOrder);
      res.status(200).json(allPosts);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { embedUrl, title, description, isActive = 'true' } = req.body;

      if (!embedUrl) {
        return res.status(400).json({ message: 'Embed URL is required' });
      }

      const db = getDb();
      await db.insert(facebookPosts).values({
        embedUrl,
        title: title || null,
        description: description || null,
        isActive,
      });

      res.status(201).json({ message: 'Facebook post added successfully' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export default requireAuth(handler);