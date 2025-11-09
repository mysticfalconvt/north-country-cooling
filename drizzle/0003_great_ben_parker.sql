CREATE TABLE IF NOT EXISTS "contact_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"link_name" text NOT NULL,
	"link_type" text NOT NULL,
	"link_value" text NOT NULL,
	"link_image" text,
	"is_active" text DEFAULT 'true',
	"sort_order" serial NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
