/*
  Warnings:

  - Added the required column `type` to the `TokenUsageRecord` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TokenConsumedType" AS ENUM ('EXCHANGE', 'CONSUME', 'INITIAL');

-- AlterTable
ALTER TABLE "TokenUsageRecord" ADD COLUMN     "type" "TokenConsumedType" NOT NULL;
