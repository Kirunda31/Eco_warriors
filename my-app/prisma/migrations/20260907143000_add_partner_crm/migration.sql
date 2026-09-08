-- Private donor and partner relationship management data.
ALTER TABLE "Partner" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE "PartnerContact" (
    "id" SERIAL NOT NULL,
    "partnerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PartnerContact_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FundingCommitment" (
    "id" SERIAL NOT NULL,
    "partnerId" INTEGER NOT NULL,
    "projectId" INTEGER,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'grant',
    "status" TEXT NOT NULL DEFAULT 'prospect',
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'UGX',
    "pledgedOn" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "reportDueDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "FundingCommitment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PartnerContact_partnerId_idx" ON "PartnerContact"("partnerId");
CREATE INDEX "FundingCommitment_partnerId_idx" ON "FundingCommitment"("partnerId");
CREATE INDEX "FundingCommitment_projectId_idx" ON "FundingCommitment"("projectId");
CREATE INDEX "FundingCommitment_status_deadline_idx" ON "FundingCommitment"("status", "deadline");

ALTER TABLE "PartnerContact" ADD CONSTRAINT "PartnerContact_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FundingCommitment" ADD CONSTRAINT "FundingCommitment_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FundingCommitment" ADD CONSTRAINT "FundingCommitment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
