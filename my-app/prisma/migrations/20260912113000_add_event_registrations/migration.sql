CREATE TABLE "EventRegistration" (
  "id" SERIAL NOT NULL, "eventId" INTEGER NOT NULL, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "phone" TEXT, "guests" INTEGER NOT NULL DEFAULT 0, "status" TEXT NOT NULL DEFAULT 'registered', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "EventRegistration_eventId_email_key" ON "EventRegistration"("eventId", "email");
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
