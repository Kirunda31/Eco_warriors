-- Complete reporting evidence and make library reports reviewable before publication.
ALTER TABLE "ProjectProgressReport" ADD COLUMN "photoUrls" TEXT,
ADD COLUMN "budgetNotes" TEXT;

ALTER TABLE "Report" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'draft';
CREATE INDEX "Report_status_idx" ON "Report"("status");
