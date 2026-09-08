-- Existing accounts retain a usable login identifier by using their email as
-- their initial username. New accounts are created by an administrator.
ALTER TABLE "User" ADD COLUMN "username" TEXT;
UPDATE "User" SET "username" = "email" WHERE "username" IS NULL;
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
