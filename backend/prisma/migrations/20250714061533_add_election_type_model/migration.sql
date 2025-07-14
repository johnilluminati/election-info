-- CreateTable
CREATE TABLE "ElectionType" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ElectionType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ElectionType_name_key" ON "ElectionType"("name");

-- AddForeignKey
ALTER TABLE "Election" ADD CONSTRAINT "Election_election_type_id_fkey" FOREIGN KEY ("election_type_id") REFERENCES "ElectionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
