CREATE TABLE IF NOT EXISTS "facebook_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"embed_url" text NOT NULL,
	"title" text,
	"description" text,
	"is_active" text DEFAULT 'true',
	"sort_order" serial NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
