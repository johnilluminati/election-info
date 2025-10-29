-- CreateEnum
CREATE TYPE "DonorType" AS ENUM ('INDIVIDUAL', 'CORPORATION', 'PAC', 'UNION', 'NONPROFIT', 'OTHER');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('FOR', 'AGAINST', 'PRESENT', 'NOT_VOTING');

-- CreateEnum
CREATE TYPE "LegislationStatus" AS ENUM ('INTRODUCED', 'PASSED', 'PENDING', 'VETOED');

-- CreateEnum
CREATE TYPE "ConflictType" AS ENUM ('FINANCIAL', 'PERSONAL', 'PROFESSIONAL');

-- CreateEnum
CREATE TYPE "ConflictSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "Donor" (
    "name" TEXT NOT NULL,
    "donor_type" "DonorType" NOT NULL,
    "organization_name" TEXT,
    "location" TEXT,
    "industry" TEXT,
    "created_on" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "Donor_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "CandidateVote" (
    "id" BIGSERIAL NOT NULL,
    "candidate_view_id" BIGINT NOT NULL,
    "bill_title" TEXT NOT NULL,
    "vote_type" "VoteType" NOT NULL,
    "vote_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "impact" TEXT,
    "stated_reason" TEXT,
    "created_on" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "CandidateVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateLegislation" (
    "id" BIGSERIAL NOT NULL,
    "candidate_view_id" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "LegislationStatus" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "impact" TEXT,
    "stated_reason" TEXT,
    "created_on" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "CandidateLegislation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConflictOfInterest" (
    "id" BIGSERIAL NOT NULL,
    "conflict_type" "ConflictType" NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "ConflictSeverity" NOT NULL,
    "impact" TEXT,
    "response" TEXT,
    "candidate_vote_id" BIGINT,
    "candidate_legislation_id" BIGINT,
    "created_on" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "ConflictOfInterest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConflictOfInterest_candidate_vote_id_idx" ON "ConflictOfInterest"("candidate_vote_id");

-- CreateIndex
CREATE INDEX "ConflictOfInterest_candidate_legislation_id_idx" ON "ConflictOfInterest"("candidate_legislation_id");

-- Note: No foreign key constraint between ElectionCandidateDonation.donor_name and Donor.name
-- We'll match them by name at the application level for flexibility

-- AddForeignKey
ALTER TABLE "CandidateVote" ADD CONSTRAINT "CandidateVote_candidate_view_id_fkey" FOREIGN KEY ("candidate_view_id") REFERENCES "CandidateView"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateLegislation" ADD CONSTRAINT "CandidateLegislation_candidate_view_id_fkey" FOREIGN KEY ("candidate_view_id") REFERENCES "CandidateView"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConflictOfInterest" ADD CONSTRAINT "ConflictOfInterest_candidate_vote_id_fkey" FOREIGN KEY ("candidate_vote_id") REFERENCES "CandidateVote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConflictOfInterest" ADD CONSTRAINT "ConflictOfInterest_candidate_legislation_id_fkey" FOREIGN KEY ("candidate_legislation_id") REFERENCES "CandidateLegislation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
