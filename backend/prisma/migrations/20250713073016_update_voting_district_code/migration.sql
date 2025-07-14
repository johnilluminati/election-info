/*
  Warnings:

  - You are about to drop the column `district_name` on the `VotingDistrict` table. All the data in the column will be lost.
  - You are about to drop the column `fips_code` on the `VotingDistrict` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[district_code]` on the table `VotingDistrict` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `district_code` to the `VotingDistrict` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "VotingDistrict_fips_code_key";

-- AlterTable
ALTER TABLE "VotingDistrict" DROP COLUMN "district_name",
DROP COLUMN "fips_code",
ADD COLUMN     "district_code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "VotingDistrict_district_code_key" ON "VotingDistrict"("district_code");
