import { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../../lib/middleware';
import { getDb } from '../../../../lib/db';
import { links } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  const linkId = parseInt(id);

  if (req.method === 'DELETE') {
    try {
      await getDb().delete(links).where(eq(links.id, linkId));
      res.status(200).json({ message: 'Link deleted successfully' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { url, title, description, images, isActive } = req.body;

      // Convert images array to JSON string for storage
      const imagesJson = images && Array.isArray(images) ? JSON.stringify(images) : null;

      await getDb()
        .update(links)
        .set({ 
          url, 
          title: title || null,
          description: description || null,
          images: imagesJson,
          isActive: isActive || 'true',
          updatedAt: new Date()
        })
        .where(eq(links.id, linkId));

      res.status(200).json({ message: 'Link updated successfully' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export default requireAuth(handler);