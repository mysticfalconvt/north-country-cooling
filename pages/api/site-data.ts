import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../lib/db';
import { siteSettings, quotes } from '../../lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get site settings
    const settings = await getDb().select().from(siteSettings).limit(1);
    
    // Get active quotes
    const activeQuotes = await getDb()
      .select()
      .from(quotes)
      .where(eq(quotes.isActive, 'true'));

    let settingsData = {};
    if (settings.length > 0) {
      const setting = settings[0];
      settingsData = {
        title: setting.title || 'North Country Cooling',
        subTitle: setting.subTitle || '',
        mainContent1: setting.mainContent1 || '',
        mainContent2: setting.mainContent2 || '',
        learnMoreText: setting.learnMoreText || '',
        contactMeContent: setting.contactMeContent || '',
        callMe: setting.callMe || '',
        emailMe: setting.emailMe || '',
        facebookMe: setting.facebookMe || '',
        facebookPost: setting.facebookPost || '',
      };
    } else {
      // Default settings if none exist
      settingsData = {
        title: 'North Country Cooling',
        subTitle: '',
        mainContent1: '',
        mainContent2: '',
        learnMoreText: '',
        contactMeContent: '',
        callMe: '',
        emailMe: '',
        facebookMe: '',
        facebookPost: '',
      };
    }

    const quotesArray = activeQuotes.map(quote => quote.text);

    const responseData = {
      ...settingsData,
      quotes: quotesArray,
    };

    // Cache for 30 seconds to match the original revalidate time
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=59');
    res.status(200).json(responseData);

  } catch (error) {
    console.error('Database error:', error);
    
    // Return fallback data in case of database error
    res.status(200).json({
      title: 'North Country Cooling',
      subTitle: '',
      mainContent1: '',
      mainContent2: '',
      learnMoreText: '',
      contactMeContent: '',
      callMe: '',
      emailMe: '',
      facebookMe: '',
      facebookPost: '',
      quotes: [],
    });
  }
}