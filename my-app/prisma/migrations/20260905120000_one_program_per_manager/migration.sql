-- A manager account may be assigned to one program. Unassigned programs remain allowed.
CREATE UNIQUE INDEX "Program_managerId_key" ON "Program"("managerId");
