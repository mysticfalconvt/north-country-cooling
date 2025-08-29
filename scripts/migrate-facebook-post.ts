#!/usr/bin/env tsx

import { config } from 'dotenv';
config(); // Load .env file

import { getDb } from '../lib/db';
import { facebookPosts, siteSettings } from '../lib/db/schema';

async function migrateFacebookPost() {
  console.log('🔄 Starting Facebook post migration...');

  try {
    const db = getDb();

    // Get the current Facebook post URL from site settings
    const settings = await db.select().from(siteSettings).limit(1);
    
    if (settings.length === 0 || !settings[0].facebookPost) {
      console.log('❌ No Facebook post found in site settings');
      process.exit(1);
    }

    const existingPost = settings[0].facebookPost;
    console.log('📥 Found existing Facebook post:', existingPost);

    // Insert the existing post into the new Facebook posts table
    await db.insert(facebookPosts).values({
      embedUrl: existingPost,
      title: 'Original Facebook Post',
      description: 'Migrated from site settings',
      isActive: 'true',
    });

    console.log('✅ Facebook post migrated successfully!');
    console.log('💡 You can now manage Facebook posts in the admin panel at /admin/login → Facebook Posts tab');
    console.log('🗑️  You can remove the old facebookPost field from site settings if desired');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

migrateFacebookPost().catch(console.error);