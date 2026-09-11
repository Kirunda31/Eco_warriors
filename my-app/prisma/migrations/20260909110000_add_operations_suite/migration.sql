-- Operations suite: beneficiary tracking, delivery metrics, documents, volunteers and reminders.
ALTER TABLE "Project" ADD COLUMN "latitude" DOUBLE PRECISION,
ADD COLUMN "longitude" DOUBLE PRECISION;

ALTER TABLE "ProjectProgressReport" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'submitted';

CREATE TABLE "BeneficiarySession" (
  "id" SERIAL NOT NULL,
  "projectId" INTEGER NOT NULL,
  "organisation" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "sessionType" TEXT NOT NULL,
  "beneficiaryCount" INTEGER NOT NULL,
  "sessionDate" TIMESTAMP(3) NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BeneficiarySession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DeliveryRecord" (
  "id" SERIAL NOT NULL,
  "projectId" INTEGER NOT NULL,
  "metricType" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "activityDate" TIMESTAMP(3) NOT NULL,
  "evidenceUrl" TEXT,
  "notes" TEXT,
  "status" TEXT NOT NULL DEFAULT 'submitted',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DeliveryRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Document" (
  "id" SERIAL NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "fileUrl" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "visibility" TEXT NOT NULL DEFAULT 'internal',
  "status" TEXT NOT NULL DEFAULT 'submitted',
  "projectId" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VolunteerAssignment" (
  "id" SERIAL NOT NULL,
  "volunteerId" INTEGER NOT NULL,
  "projectId" INTEGER,
  "role" TEXT NOT NULL,
  "startDate" TIMESTAMP(3),
  "endDate" TIMESTAMP(3),
  "attendance" TEXT NOT NULL DEFAULT 'pending',
  "certificateUrl" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "VolunteerAssignment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Reminder" (
  "id" SERIAL NOT NULL,
  "title" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "dueDate" TIMESTAMP(3) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'open',
  "notes" TEXT,
  "projectId" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "BeneficiarySession_projectId_sessionDate_idx" ON "BeneficiarySession"("projectId", "sessionDate");
CREATE INDEX "DeliveryRecord_projectId_metricType_status_idx" ON "DeliveryRecord"("projectId", "metricType", "status");
CREATE INDEX "Document_projectId_status_idx" ON "Document"("projectId", "status");
CREATE INDEX "VolunteerAssignment_volunteerId_idx" ON "VolunteerAssignment"("volunteerId");
CREATE INDEX "VolunteerAssignment_projectId_idx" ON "VolunteerAssignment"("projectId");
CREATE INDEX "Reminder_dueDate_status_idx" ON "Reminder"("dueDate", "status");
CREATE INDEX "Reminder_projectId_idx" ON "Reminder"("projectId");

ALTER TABLE "BeneficiarySession" ADD CONSTRAINT "BeneficiarySession_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DeliveryRecord" ADD CONSTRAINT "DeliveryRecord_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Document" ADD CONSTRAINT "Document_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VolunteerAssignment" ADD CONSTRAINT "VolunteerAssignment_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "VolunteerAssignment" ADD CONSTRAINT "VolunteerAssignment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
