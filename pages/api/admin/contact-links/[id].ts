import { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../../lib/middleware';
import { getDb } from '../../../../lib/db';
import { contactLinks } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const db = getDb();

  if (req.method === 'PUT') {
    try {
      const { text, linkName, linkType, linkValue, linkImage, isActive } = req.body;

      if (!text || !linkName || !linkType || !linkValue) {
        return res.status(400).json({ message: 'Text, link name, link type, and link value are required' });
      }

      if (!['call', 'email', 'url'].includes(linkType)) {
        return res.status(400).json({ message: 'Link type must be call, email, or url' });
      }

      const updatedContactLink = await db
        .update(contactLinks)
        .set({
          text,
          linkName,
          linkType,
          linkValue,
          linkImage,
          isActive: isActive || 'true',
          updatedAt: new Date(),
        })
        .where(eq(contactLinks.id, parseInt(id as string)))
        .returning();

      if (updatedContactLink.length === 0) {
        return res.status(404).json({ message: 'Contact link not found' });
      }

      res.status(200).json(updatedContactLink[0]);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deletedContactLink = await db
        .delete(contactLinks)
        .where(eq(contactLinks.id, parseInt(id as string)))
        .returning();

      if (deletedContactLink.length === 0) {
        return res.status(404).json({ message: 'Contact link not found' });
      }

      res.status(200).json({ message: 'Contact link deleted successfully' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export default requireAuth(handler);