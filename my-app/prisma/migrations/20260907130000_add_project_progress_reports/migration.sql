-- Internal project implementation updates. These records are deliberately not
-- surfaced through any public route.
CREATE TABLE "ProjectProgressReport" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "submittedById" INTEGER NOT NULL,
    "reportingPeriod" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "achievements" TEXT NOT NULL,
    "challenges" TEXT NOT NULL,
    "nextSteps" TEXT NOT NULL,
    "evidenceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectProgressReport_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ProjectProgressReport"
    ADD CONSTRAINT "ProjectProgressReport_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ProjectProgressReport"
    ADD CONSTRAINT "ProjectProgressReport_submittedById_fkey"
    FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
