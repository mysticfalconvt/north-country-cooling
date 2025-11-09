import { pgTable, text, serial, timestamp } from 'drizzle-orm/pg-core';

export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  subTitle: text('sub_title'),
  mainContent1: text('main_content_1'),
  mainContent2: text('main_content_2'),
  learnMoreText: text('learn_more_text'),
  contactMeContent: text('contact_me_content'),
  callMe: text('call_me'),
  emailMe: text('email_me'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const quotes = pgTable('quotes', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  isActive: text('is_active').default('true'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  title: text('title'),
  description: text('description'),
  images: text('images'), // JSON array of image URLs
  isActive: text('is_active').default('true'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const facebookPosts = pgTable('facebook_posts', {
  id: serial('id').primaryKey(),
  embedUrl: text('embed_url').notNull(),
  title: text('title'),
  description: text('description'),
  isActive: text('is_active').default('true'),
  sortOrder: serial('sort_order'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const contactLinks = pgTable('contact_links', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  linkName: text('link_name').notNull(),
  linkType: text('link_type').notNull(), // 'call', 'email', 'url'
  linkValue: text('link_value').notNull(), // phone number, email, or URL
  linkImage: text('link_image'), // optional image URL or icon class
  isActive: text('is_active').default('true'),
  sortOrder: serial('sort_order'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});