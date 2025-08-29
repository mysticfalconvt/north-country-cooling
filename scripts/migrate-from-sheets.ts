#!/usr/bin/env tsx

import { config } from 'dotenv';
config(); // Load .env file

import { getSheetsDataFromGoogle, getLinksDataFromGoogle } from './google-sheets-api';
import { getDb } from '../lib/db';
import { siteSettings, quotes, links } from '../lib/db/schema';

async function migrateFromGoogleSheets() {
  console.log('🔄 Starting migration from Google Sheets to database...');

  try {
    const db = getDb();

    // Get data from Google Sheets
    console.log('📥 Fetching data from Google Sheets...');
    const sheetsData = await getSheetsDataFromGoogle();
    const linksData = await getLinksDataFromGoogle();

    if (!sheetsData) {
      console.error('❌ Failed to retrieve data from Google Sheets');
      process.exit(1);
    }

    console.log('✅ Data retrieved from Google Sheets');
    console.log('📊 Site data keys:', Object.keys(sheetsData));
    console.log('📊 Quotes count:', sheetsData.quotes?.length || 0);
    console.log('📊 Links count:', linksData?.length || 0);

    // Clear existing data
    console.log('🗑️ Clearing existing database data...');
    await db.delete(siteSettings);
    await db.delete(quotes);
    await db.delete(links);

    // Insert site settings
    console.log('📝 Inserting site settings...');
    await db.insert(siteSettings).values({
      title: sheetsData.title || 'North Country Cooling',
      subTitle: sheetsData.subTitle || '',
      mainContent1: sheetsData.mainContent1 || '',
      mainContent2: sheetsData.mainContent2 || '',
      learnMoreText: sheetsData.learnMoreText || '',
      contactMeContent: sheetsData.contactMeContent || '',
      callMe: sheetsData.callMe || '',
      emailMe: sheetsData.emailMe || '',
      facebookMe: sheetsData.facebookMe || '',
      facebookPost: sheetsData.facebookPost || '',
    });

    // Insert quotes
    if (sheetsData.quotes && sheetsData.quotes.length > 0) {
      console.log(`📝 Inserting ${sheetsData.quotes.length} quotes...`);
      for (const quote of sheetsData.quotes) {
        await db.insert(quotes).values({
          text: quote,
          isActive: 'true',
        });
      }
    }

    // Insert links
    if (linksData && linksData.length > 0) {
      console.log(`📝 Inserting ${linksData.length} links...`);
      for (const link of linksData) {
        await db.insert(links).values({
          url: link,
          isActive: 'true',
        });
      }
    }

    console.log('✅ Migration completed successfully!');
    console.log('🎉 Your Google Sheets data has been migrated to the database.');
    console.log('💡 You can now use the admin panel to manage your content at /admin/login');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

migrateFromGoogleSheets().catch(console.error);