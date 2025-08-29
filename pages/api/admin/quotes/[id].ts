import { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../../lib/middleware';
import { getDb } from '../../../../lib/db';
import { quotes } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  const quoteId = parseInt(id);

  if (req.method === 'DELETE') {
    try {
      await getDb().delete(quotes).where(eq(quotes.id, quoteId));
      res.status(200).json({ message: 'Quote deleted successfully' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { text, isActive } = req.body;

      await db
        .update(quotes)
        .set({ 
          text, 
          isActive,
          updatedAt: new Date()
        })
        .where(eq(quotes.id, quoteId));

      res.status(200).json({ message: 'Quote updated successfully' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export default requireAuth(handler);