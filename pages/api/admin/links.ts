import { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../lib/middleware';
import { getDb } from '../../../lib/db';
import { links } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const allLinks = await getDb().select().from(links).orderBy(links.createdAt);
      res.status(200).json(allLinks);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { url, title, description, images, isActive = 'true' } = req.body;

      if (!url) {
        return res.status(400).json({ message: 'URL is required' });
      }

      // Convert images array to JSON string for storage
      const imagesJson = images && Array.isArray(images) ? JSON.stringify(images) : null;

      await getDb().insert(links).values({
        url,
        title: title || null,
        description: description || null,
        images: imagesJson,
        isActive,
      });

      res.status(201).json({ message: 'Link added successfully' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export default requireAuth(handler);