ALTER TABLE "ProjectProgressReport"
    DROP CONSTRAINT "ProjectProgressReport_submittedById_fkey";

ALTER TABLE "ProjectProgressReport"
    ALTER COLUMN "submittedById" DROP NOT NULL;

ALTER TABLE "ProjectProgressReport"
    ADD CONSTRAINT "ProjectProgressReport_submittedById_fkey"
    FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
