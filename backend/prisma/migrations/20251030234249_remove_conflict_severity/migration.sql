/*
  Warnings:

  - You are about to drop the column `severity` on the `ConflictOfInterest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ConflictOfInterest" DROP COLUMN "severity";

-- DropEnum
DROP TYPE "ConflictSeverity";

-- AddForeignKey
ALTER TABLE "ElectionCandidateDonation" ADD CONSTRAINT "ElectionCandidateDonation_donor_name_fkey" FOREIGN KEY ("donor_name") REFERENCES "Donor"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
