-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "managerId" INTEGER;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
