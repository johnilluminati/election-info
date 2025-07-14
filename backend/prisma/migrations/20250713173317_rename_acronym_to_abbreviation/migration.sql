/*
  Warnings:

  - You are about to drop the column `acronym` on the `USState` table. All the data in the column will be lost.
  - Added the required column `abbreviation` to the `USState` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "USState" DROP COLUMN "acronym",
ADD COLUMN     "abbreviation" TEXT NOT NULL;
