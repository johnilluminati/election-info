-- CreateEnum
CREATE TYPE "IncumbencyStatus" AS ENUM ('INCUMBENT', 'CHALLENGER', 'OPEN_SEAT');

-- AlterTable
ALTER TABLE "ElectionCandidate" ADD COLUMN     "incumbency_status" "IncumbencyStatus";

-- CreateIndex
CREATE INDEX "ElectionGeography_scope_type_scope_id_idx" ON "ElectionGeography"("scope_type", "scope_id");

-- CreateIndex
CREATE INDEX "ElectionGeography_election_id_idx" ON "ElectionGeography"("election_id");
