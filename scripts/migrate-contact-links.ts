#!/usr/bin/env tsx

import 'dotenv/config';
import { getDb } from '../lib/db';
import { contactLinks } from '../lib/db/schema';

async function migrateContactLinks() {
  console.log('🔗 Migrating existing contact links to database...\n');

  const db = getDb();

  // Define the existing contact links from the codebase
  const existingContactLinks = [
    {
      text: 'Call them for a free estimate!',
      linkName: 'Call Me',
      linkType: 'call',
      linkValue: '802-249-4858',
      linkImage: '📞', // or could be a phone icon class
      isActive: 'true',
      sortOrder: 1
    },
    {
      text: 'Send us an email for questions',
      linkName: 'Email Us',
      linkType: 'email', 
      linkValue: 'info@northcountrycooling.com', // placeholder - should be updated in admin
      linkImage: '📧', // or could be an email icon class
      isActive: 'true',
      sortOrder: 2
    }
  ];

  try {
    // Check if contact links already exist
    const existingLinks = await db.select().from(contactLinks);
    
    if (existingLinks.length > 0) {
      console.log(`ℹ️  Found ${existingLinks.length} existing contact links. Skipping migration.`);
      return;
    }

    console.log('📝 Adding contact links to database...');

    for (const link of existingContactLinks) {
      const result = await db.insert(contactLinks).values(link).returning();
      console.log(`✅ Added contact link: ${result[0].linkName} (${result[0].linkType})`);
    }

    console.log('\n🎉 Contact links migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update contact link values in the admin panel');
    console.log('2. Add any additional contact methods you need');
    console.log('3. Customize link images/icons as desired');
    
  } catch (error) {
    console.error('❌ Error migrating contact links:', error);
    throw error;
  }
}

// Run the migration
migrateContactLinks().catch(console.error);