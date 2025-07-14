-- CreateEnum
CREATE TYPE "GeographyType" AS ENUM ('NATIONAL', 'STATE', 'COUNTY', 'CITY', 'DISTRICT');

-- CreateTable
CREATE TABLE "USState" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "acronym" TEXT NOT NULL,
    "fips_code" TEXT NOT NULL,

    CONSTRAINT "USState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USCounty" (
    "id" BIGSERIAL NOT NULL,
    "us_state_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "fips_code" TEXT NOT NULL,

    CONSTRAINT "USCounty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USCity" (
    "id" BIGSERIAL NOT NULL,
    "us_state_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "fips_code" TEXT NOT NULL,

    CONSTRAINT "USCity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USCityCounty" (
    "city_id" BIGINT NOT NULL,
    "county_id" BIGINT NOT NULL,

    CONSTRAINT "USCityCounty_pkey" PRIMARY KEY ("city_id","county_id")
);

-- CreateTable
CREATE TABLE "VotingDistrict" (
    "id" BIGSERIAL NOT NULL,
    "us_state_id" BIGINT NOT NULL,
    "district_name" TEXT NOT NULL,
    "fips_code" TEXT NOT NULL,

    CONSTRAINT "VotingDistrict_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VotingDistrictCity" (
    "district_id" BIGINT NOT NULL,
    "city_id" BIGINT NOT NULL,

    CONSTRAINT "VotingDistrictCity_pkey" PRIMARY KEY ("district_id","city_id")
);

-- CreateTable
CREATE TABLE "VotingDistrictCounty" (
    "district_id" BIGINT NOT NULL,
    "county_id" BIGINT NOT NULL,

    CONSTRAINT "VotingDistrictCounty_pkey" PRIMARY KEY ("district_id","county_id")
);

-- CreateTable
CREATE TABLE "ElectionCycle" (
    "id" BIGSERIAL NOT NULL,
    "election_year" INTEGER NOT NULL,
    "election_day" TIMESTAMP(3) NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "ElectionCycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Election" (
    "id" BIGSERIAL NOT NULL,
    "election_cycle_id" BIGINT NOT NULL,
    "election_type_id" BIGINT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "Election_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" BIGSERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "nickname" TEXT,
    "picture_link" TEXT,
    "created_on" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoliticalParty" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "party_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "PoliticalParty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateParty" (
    "id" BIGSERIAL NOT NULL,
    "candidate_id" BIGINT NOT NULL,
    "political_party_id" BIGINT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "created_on" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "CandidateParty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectionCandidate" (
    "id" BIGSERIAL NOT NULL,
    "election_id" BIGINT NOT NULL,
    "candidate_id" BIGINT NOT NULL,
    "party_id" BIGINT NOT NULL,
    "website" TEXT,
    "created_on" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "ElectionCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateKeyIssue" (
    "id" BIGSERIAL NOT NULL,
    "election_candidate_id" BIGINT NOT NULL,
    "issue_text" TEXT NOT NULL,
    "order_of_important" INTEGER NOT NULL,
    "view_text" TEXT,
    "created_on" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "CandidateKeyIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateView" (
    "id" BIGSERIAL NOT NULL,
    "candidate_id" BIGINT NOT NULL,
    "view_type_id" BIGINT NOT NULL,
    "view_text" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "CandidateView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateViewCategory" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "CandidateViewCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateHistory" (
    "id" BIGSERIAL NOT NULL,
    "candidate_id" BIGINT NOT NULL,
    "history_text" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "CandidateHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectionCandidateDonation" (
    "id" BIGSERIAL NOT NULL,
    "election_candidate_id" BIGINT NOT NULL,
    "donor_name" TEXT NOT NULL,
    "donation_amount" DECIMAL(65,30) NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "ElectionCandidateDonation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectionGeography" (
    "id" BIGSERIAL NOT NULL,
    "election_id" BIGINT NOT NULL,
    "scope_type" "GeographyType" NOT NULL,
    "scope_id" BIGINT NOT NULL,

    CONSTRAINT "ElectionGeography_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USState_fips_code_key" ON "USState"("fips_code");

-- CreateIndex
CREATE UNIQUE INDEX "USCounty_fips_code_key" ON "USCounty"("fips_code");

-- CreateIndex
CREATE UNIQUE INDEX "USCity_fips_code_key" ON "USCity"("fips_code");

-- CreateIndex
CREATE UNIQUE INDEX "VotingDistrict_fips_code_key" ON "VotingDistrict"("fips_code");

-- AddForeignKey
ALTER TABLE "USCounty" ADD CONSTRAINT "USCounty_us_state_id_fkey" FOREIGN KEY ("us_state_id") REFERENCES "USState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USCity" ADD CONSTRAINT "USCity_us_state_id_fkey" FOREIGN KEY ("us_state_id") REFERENCES "USState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USCityCounty" ADD CONSTRAINT "USCityCounty_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "USCity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USCityCounty" ADD CONSTRAINT "USCityCounty_county_id_fkey" FOREIGN KEY ("county_id") REFERENCES "USCounty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotingDistrict" ADD CONSTRAINT "VotingDistrict_us_state_id_fkey" FOREIGN KEY ("us_state_id") REFERENCES "USState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotingDistrictCity" ADD CONSTRAINT "VotingDistrictCity_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "VotingDistrict"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotingDistrictCity" ADD CONSTRAINT "VotingDistrictCity_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "USCity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotingDistrictCounty" ADD CONSTRAINT "VotingDistrictCounty_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "VotingDistrict"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotingDistrictCounty" ADD CONSTRAINT "VotingDistrictCounty_county_id_fkey" FOREIGN KEY ("county_id") REFERENCES "USCounty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Election" ADD CONSTRAINT "Election_election_cycle_id_fkey" FOREIGN KEY ("election_cycle_id") REFERENCES "ElectionCycle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateParty" ADD CONSTRAINT "CandidateParty_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateParty" ADD CONSTRAINT "CandidateParty_political_party_id_fkey" FOREIGN KEY ("political_party_id") REFERENCES "PoliticalParty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectionCandidate" ADD CONSTRAINT "ElectionCandidate_election_id_fkey" FOREIGN KEY ("election_id") REFERENCES "Election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectionCandidate" ADD CONSTRAINT "ElectionCandidate_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectionCandidate" ADD CONSTRAINT "ElectionCandidate_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "PoliticalParty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateKeyIssue" ADD CONSTRAINT "CandidateKeyIssue_election_candidate_id_fkey" FOREIGN KEY ("election_candidate_id") REFERENCES "ElectionCandidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateView" ADD CONSTRAINT "CandidateView_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateView" ADD CONSTRAINT "CandidateView_view_type_id_fkey" FOREIGN KEY ("view_type_id") REFERENCES "CandidateViewCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateHistory" ADD CONSTRAINT "CandidateHistory_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectionCandidateDonation" ADD CONSTRAINT "ElectionCandidateDonation_election_candidate_id_fkey" FOREIGN KEY ("election_candidate_id") REFERENCES "ElectionCandidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectionGeography" ADD CONSTRAINT "ElectionGeography_election_id_fkey" FOREIGN KEY ("election_id") REFERENCES "Election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
