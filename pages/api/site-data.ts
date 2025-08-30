import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../lib/db';
import { siteSettings, quotes } from '../../lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🏠 Site-data API called:', req.method, req.url);
  
  if (req.method !== 'GET') {
    console.log('❌ Invalid method:', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('🔗 Getting database connection...');
    
    // Log DATABASE_URL status (masked for security)
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':***@');
      console.log('🔗 DATABASE_URL is set:', maskedUrl);
    } else {
      console.log('❌ DATABASE_URL is not set');
    }
    
    // Check if DATABASE_URL is available (it won't be during build)
    if (!process.env.DATABASE_URL) {
      console.log('⚠️ DATABASE_URL not available during build, returning fallback data');
      const fallbackData = {
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
      };
      return res.status(200).json(fallbackData);
    }
    
    const db = getDb();
    
    console.log('📊 Querying site settings...');
    const settings = await db.select().from(siteSettings).limit(1);
    console.log('🏠 Raw site settings from DB:', JSON.stringify(settings, null, 2));
    
    console.log('💬 Querying active quotes...');
    const activeQuotes = await db
      .select()
      .from(quotes)
      .where(eq(quotes.isActive, 'true'));
    console.log('💬 Raw active quotes from DB:', JSON.stringify(activeQuotes, null, 2));

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

    console.log('✅ Site-data query successful, returning data:', JSON.stringify(responseData, null, 2));

    // Cache for 30 seconds to match the original revalidate time
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=59');
    res.status(200).json(responseData);

  } catch (error) {
    console.error('❌ Site-data API error:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // Return fallback data in case of database error
    console.log('⚠️ Returning fallback data due to error');
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