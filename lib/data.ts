import { getDb } from './db';
import { siteSettings, quotes, facebookPosts, contactLinks, links } from './db/schema';
import { eq } from 'drizzle-orm';

// Direct database functions for use in getStaticProps (build time)
export async function getSiteDataDirect() {
  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      return {
        title: 'North Country Cooling',
        subTitle: '',
        mainContent1: '',
        mainContent2: '',
        learnMoreText: '',
        contactMeContent: '',
        callMe: '',
        emailMe: '',
        quotes: [],
      };
    }

    const db = getDb();
    
    const settings = await db.select().from(siteSettings).limit(1);
    
    const activeQuotes = await db
      .select()
      .from(quotes)
      .where(eq(quotes.isActive, 'true'));

    let settingsData = {};
    if (settings.length > 0) {
      const setting = settings[0];
      settingsData = {
        id: setting.id,
        title: setting.title || 'North Country Cooling',
        subTitle: setting.subTitle || '',
        mainContent1: setting.mainContent1 || '',
        mainContent2: setting.mainContent2 || '',
        learnMoreText: setting.learnMoreText || '',
        contactMeContent: setting.contactMeContent || '',
        callMe: setting.callMe || '',
        emailMe: setting.emailMe || '',
        updatedAt: setting.updatedAt?.toISOString(),
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
      };
    }

    const quotesArray = activeQuotes.map(quote => quote.text);
    const quotesWithDates = activeQuotes.map(quote => ({
      id: quote.id,
      text: quote.text,
      isActive: quote.isActive,
      createdAt: quote.createdAt?.toISOString(),
      updatedAt: quote.updatedAt?.toISOString()
    }));

    const responseData = {
      ...settingsData,
      quotes: quotesArray,
      quotesWithDates: quotesWithDates, // Include full quote objects with serialized dates
    };

    return responseData;

  } catch (error) {
    console.error('Site-data direct query error:', error);
    
    // Return fallback data in case of database error
    return {
      title: 'North Country Cooling',
      subTitle: '',
      mainContent1: '',
      mainContent2: '',
      learnMoreText: '',
      contactMeContent: '',
      callMe: '',
      emailMe: '',
      quotes: [],
    };
  }
}

export async function getFacebookPostsDirect() {
  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      return [];
    }

    const db = getDb();
    
    const activePosts = await db
      .select()
      .from(facebookPosts)
      .where(eq(facebookPosts.isActive, 'true'))
      .orderBy(facebookPosts.sortOrder);

    const postsArray = activePosts.map(post => ({
      id: post.id,
      embedUrl: post.embedUrl,
      title: post.title,
      description: post.description,
      sortOrder: post.sortOrder,
      createdAt: post.createdAt?.toISOString() || null,
      updatedAt: post.updatedAt?.toISOString() || null
    }));

    return postsArray;

  } catch (error) {
    console.error('Facebook posts direct query error:', error);
    
    return [];
  }
}

export async function getContactLinksDirect() {
  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      return [];
    }

    const db = getDb();
    
    const activeContactLinks = await db
      .select()
      .from(contactLinks)
      .where(eq(contactLinks.isActive, 'true'))
      .orderBy(contactLinks.sortOrder, contactLinks.createdAt);

    // Convert dates to strings for JSON serialization
    const serializedContactLinks = activeContactLinks.map(link => ({
      ...link,
      createdAt: link.createdAt?.toISOString() || null,
      updatedAt: link.updatedAt?.toISOString() || null
    }));

    return serializedContactLinks;

  } catch (error) {
    console.error('Contact links direct query error:', error);
    
    return [];
  }
}

export async function getLinksDataDirect() {
  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      return [];
    }

    const db = getDb();
    
    const activeLinks = await db
      .select()
      .from(links)
      .where(eq(links.isActive, 'true'))
      .orderBy(links.createdAt);

    const linksArray = activeLinks.map(link => ({
      url: link.url,
      title: link.title,
      description: link.description,
      images: link.images ? JSON.parse(link.images) : null,
      createdAt: link.createdAt?.toISOString() || null,
      updatedAt: link.updatedAt?.toISOString() || null
    }));

    return linksArray;

  } catch (error) {
    console.error('Links-data direct query error:', error);
    
    return [];
  }
}