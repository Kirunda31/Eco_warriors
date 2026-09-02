-- CreateTable
CREATE TABLE "Story" (
    "id" SERIAL NOT NULL,
    "personName" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "intervention" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "quote" TEXT,
    "fullStory" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "projectId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Story_slug_key" ON "Story"("slug");

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
