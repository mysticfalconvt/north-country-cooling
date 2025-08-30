import { getDb } from './db';
import { siteSettings, quotes, facebookPosts, contactLinks, links } from './db/schema';
import { eq } from 'drizzle-orm';

// Direct database functions for use in getStaticProps (build time)
export async function getSiteDataDirect() {
  console.log('🏠 getSiteDataDirect called');
  
  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.log('⚠️ DATABASE_URL not available during build, returning fallback data');
      return {
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
    }

    console.log('🔗 Getting database connection...');
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
    return responseData;

  } catch (error) {
    console.error('❌ Site-data direct query error:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // Return fallback data in case of database error
    console.log('⚠️ Returning fallback data due to error');
    return {
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
  }
}

export async function getFacebookPostsDirect() {
  console.log('📱 getFacebookPostsDirect called');
  
  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.log('⚠️ DATABASE_URL not available during build, returning empty array');
      return [];
    }

    console.log('🔗 Getting database connection...');
    const db = getDb();
    
    console.log('📊 Querying facebook posts...');
    const activePosts = await db
      .select()
      .from(facebookPosts)
      .where(eq(facebookPosts.isActive, 'true'))
      .orderBy(facebookPosts.sortOrder);

    console.log('📱 Raw facebook posts from DB:', JSON.stringify(activePosts, null, 2));

    const postsArray = activePosts.map(post => ({
      id: post.id,
      embedUrl: post.embedUrl,
      title: post.title,
      description: post.description
    }));

    console.log('✅ Facebook posts query successful, returning:', postsArray.length, 'posts');
    console.log('📱 Final posts array:', JSON.stringify(postsArray, null, 2));

    return postsArray;

  } catch (error) {
    console.error('❌ Facebook posts direct query error:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    console.log('⚠️ Returning empty array due to error');
    return [];
  }
}

export async function getContactLinksDirect() {
  console.log('📞 getContactLinksDirect called');
  
  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.log('⚠️ DATABASE_URL not available during build, returning empty array');
      return [];
    }

    console.log('🔗 Getting database connection...');
    const db = getDb();
    
    console.log('📊 Querying contact links...');
    const activeContactLinks = await db
      .select()
      .from(contactLinks)
      .where(eq(contactLinks.isActive, 'true'))
      .orderBy(contactLinks.sortOrder, contactLinks.createdAt);

    console.log('📞 Raw contact links from DB:', JSON.stringify(activeContactLinks, null, 2));
    console.log('✅ Contact links query successful, found:', activeContactLinks.length, 'links');

    return activeContactLinks;

  } catch (error) {
    console.error('❌ Contact links direct query error:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    console.log('⚠️ Returning empty array due to error');
    return [];
  }
}

export async function getLinksDataDirect() {
  console.log('🔗 getLinksDataDirect called');
  
  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.log('⚠️ DATABASE_URL not available during build, returning empty array');
      return [];
    }

    console.log('🔗 Getting database connection...');
    const db = getDb();
    
    console.log('📊 Querying active links...');
    const activeLinks = await db
      .select()
      .from(links)
      .where(eq(links.isActive, 'true'))
      .orderBy(links.createdAt);

    console.log('🔗 Raw active links from DB:', JSON.stringify(activeLinks, null, 2));

    const linksArray = activeLinks.map(link => ({
      url: link.url,
      title: link.title,
      description: link.description,
      images: link.images ? JSON.parse(link.images) : null
    }));

    console.log('✅ Links-data query successful, returning:', linksArray.length, 'links');
    console.log('🔗 Final links array:', JSON.stringify(linksArray, null, 2));

    return linksArray;

  } catch (error) {
    console.error('❌ Links-data direct query error:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    console.log('⚠️ Returning empty array due to error');
    return [];
  }
}