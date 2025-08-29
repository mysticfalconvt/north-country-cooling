import { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../lib/middleware';
import { getDb } from '../../../lib/db';
import { quotes } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const db = getDb();
      const allQuotes = await getDb().select().from(quotes).orderBy(quotes.createdAt);
      res.status(200).json(allQuotes);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { text, isActive = 'true' } = req.body;

      if (!text) {
        return res.status(400).json({ message: 'Quote text is required' });
      }

      const db = getDb();
      await getDb().insert(quotes).values({
        text,
        isActive,
      });

      res.status(201).json({ message: 'Quote added successfully' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export default requireAuth(handler);