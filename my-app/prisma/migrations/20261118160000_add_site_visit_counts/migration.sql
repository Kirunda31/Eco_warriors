CREATE TABLE "SiteVisitDaily" (
    "day" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteVisitDaily_pkey" PRIMARY KEY ("day", "path")
);

CREATE INDEX "SiteVisitDaily_day_idx" ON "SiteVisitDaily"("day");
