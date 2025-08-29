#!/usr/bin/env tsx

import { config } from 'dotenv';
config(); // Load .env file

import { createAdminUser } from '../lib/auth';

async function setupAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error('Please set ADMIN_USERNAME and ADMIN_PASSWORD environment variables');
    process.exit(1);
  }

  console.log('Creating admin user...');
  const success = await createAdminUser(username, password);

  if (success) {
    console.log('✅ Admin user created successfully!');
    console.log(`Username: ${username}`);
    console.log('You can now log in at /admin/login');
  } else {
    console.error('❌ Failed to create admin user. User might already exist.');
  }

  process.exit(0);
}

setupAdmin().catch(console.error);