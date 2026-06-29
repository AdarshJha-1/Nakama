ALTER TABLE "notification" ALTER COLUMN "read" SET DEFAULT false;--> statement-breakpoint
UPDATE "notification"
SET "read" = false
WHERE "read" IS NULL;
--> statement-breakpoint
ALTER TABLE "notification" ALTER COLUMN "read" SET NOT NULL;