import { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../lib/middleware';
import { getDb } from '../../../lib/db';
import { siteSettings } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const db = getDb();
      const settings = await db.select().from(siteSettings).limit(1);
      
      if (settings.length === 0) {
        // Return default settings if none exist
        return res.status(200).json({
          title: 'North Country Cooling',
          subTitle: '',
          mainContent1: '',
          mainContent2: '',
          learnMoreText: '',
          contactMeContent: '',
          callMe: '',
          emailMe: '',
        });
      }
      
      res.status(200).json(settings[0]);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        title,
        subTitle,
        mainContent1,
        mainContent2,
        learnMoreText,
        contactMeContent,
        callMe,
        emailMe,
      } = req.body;

      const db = getDb();
      // Check if settings exist
      const existingSettings = await db.select().from(siteSettings).limit(1);

      if (existingSettings.length === 0) {
        // Insert new settings
        await db.insert(siteSettings).values({
          title,
          subTitle,
          mainContent1,
          mainContent2,
          learnMoreText,
          contactMeContent,
          callMe,
          emailMe,
        });
      } else {
        // Update existing settings
        await db
          .update(siteSettings)
          .set({
            title,
            subTitle,
            mainContent1,
            mainContent2,
            learnMoreText,
            contactMeContent,
            callMe,
            emailMe,
            updatedAt: new Date(),
          })
          .where(eq(siteSettings.id, existingSettings[0].id));
      }

      res.status(200).json({ message: 'Settings saved successfully' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export default requireAuth(handler);