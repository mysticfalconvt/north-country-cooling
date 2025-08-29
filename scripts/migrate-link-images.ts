#!/usr/bin/env tsx

import { config } from 'dotenv';
config(); // Load .env file

import { getDb } from '../lib/db';
import { links } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function migrateLinkImages() {
  console.log('🔄 Starting migration to populate link images...');

  try {
    const db = getDb();

    // Define the hardcoded image data from the original code
    const linkImageData = [
      {
        urlPattern: 'financing/homes/home-energy-loan',
        title: 'Efficiency Vermont Financing',
        description: 'Learn more about financing options',
        images: [
          'https://www.efficiencyvermont.com/Media/Default/images/home-page/home-contractor.jpg?width=480&quality=90',
          'https://www.efficiencyvermont.com/Media/Default/images/home-page/channel-marketplace.jpg',
          'https://www.efficiencyvermont.com/Media/Default/blog/HowTo/EVT-Blog-HowTo-HeatPump-Header.jpg',
        ],
      },
      {
        urlPattern: 'ont.com/find-contractor-retailer',
        title: 'Efficiency Vermont Contractor Listing',
        description: 'Efficiency Excellence Network Member.\nTrained and evaluated by Efficiency Vermont to provide the highest level of professional energy efficiency services.',
        images: [
          'https://www.efficiencyvermont.com/Media/Default/images/home-page/channel-marketplace.jpg',
          'https://www.efficiencyvermont.com/Media/Default/blog/HowTo/EVT-Blog-HowTo-HeatPump-Header.jpg',
          'https://www.efficiencyvermont.com/Media/Default/images/home-page/home-contractor.jpg?width=480&quality=90',
        ],
      },
    ];

    // Get all existing links
    const allLinks = await db.select().from(links);
    console.log(`📊 Found ${allLinks.length} links to check for updates`);

    let updatedCount = 0;

    // Update links that match the patterns
    for (const link of allLinks) {
      for (const imageData of linkImageData) {
        if (link.url.includes(imageData.urlPattern)) {
          console.log(`📝 Updating link: ${link.url}`);
          
          await db
            .update(links)
            .set({
              title: imageData.title,
              description: imageData.description,
              images: JSON.stringify(imageData.images),
              updatedAt: new Date(),
            })
            .where(eq(links.id, link.id));

          updatedCount++;
          break; // Move to next link after finding a match
        }
      }
    }

    console.log(`✅ Migration completed successfully!`);
    console.log(`📊 Updated ${updatedCount} links with custom titles, descriptions, and images`);
    console.log(`💡 You can now manage these enhanced links in the admin panel at /admin/login`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

migrateLinkImages().catch(console.error);