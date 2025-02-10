/*
  Warnings:

  - You are about to drop the column `imgUrl` on the `TokenUsageRecord` table. All the data in the column will be lost.
  - You are about to drop the column `result` on the `TokenUsageRecord` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTREMELY_ACTIVE');

-- AlterTable
ALTER TABLE "TokenUsageRecord" DROP COLUMN "imgUrl",
DROP COLUMN "result";

-- CreateTable
CREATE TABLE "AnalysisRecord" (
    "id" TEXT NOT NULL,
    "tokenUsageRecordId" TEXT NOT NULL,
    "imageURL" TEXT NOT NULL,
    "foods" JSONB NOT NULL,
    "comments" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalysisRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserHealth" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "bmr" DOUBLE PRECISION NOT NULL,
    "activityLevel" "ActivityLevel" NOT NULL DEFAULT 'SEDENTARY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserHealth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnalysisRecord_tokenUsageRecordId_key" ON "AnalysisRecord"("tokenUsageRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "UserHealth_userId_key" ON "UserHealth"("userId");

-- CreateIndex
CREATE INDEX "UserHealth_userId_idx" ON "UserHealth"("userId");

-- AddForeignKey
ALTER TABLE "AnalysisRecord" ADD CONSTRAINT "AnalysisRecord_tokenUsageRecordId_fkey" FOREIGN KEY ("tokenUsageRecordId") REFERENCES "TokenUsageRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHealth" ADD CONSTRAINT "UserHealth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
