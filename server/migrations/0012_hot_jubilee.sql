ALTER TABLE "reviews" ADD COLUMN "rating" real NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN IF EXISTS "rathing";