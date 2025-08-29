import { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../lib/middleware';
import { getDb } from '../../../lib/db';
import { contactLinks } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const db = getDb();
      const allContactLinks = await db.select().from(contactLinks).orderBy(contactLinks.sortOrder, contactLinks.createdAt);
      res.status(200).json(allContactLinks);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { text, linkName, linkType, linkValue, linkImage } = req.body;

      if (!text || !linkName || !linkType || !linkValue) {
        return res.status(400).json({ message: 'Text, link name, link type, and link value are required' });
      }

      if (!['call', 'email', 'url'].includes(linkType)) {
        return res.status(400).json({ message: 'Link type must be call, email, or url' });
      }

      const db = getDb();
      await db.insert(contactLinks).values({
        text,
        linkName,
        linkType,
        linkValue,
        linkImage,
        isActive: 'true',
      });

      res.status(201).json({ message: 'Contact link added successfully' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export default requireAuth(handler);