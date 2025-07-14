/*
  Warnings:

  - A unique constraint covering the columns `[party_code]` on the table `PoliticalParty` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PoliticalParty_party_code_key" ON "PoliticalParty"("party_code");
