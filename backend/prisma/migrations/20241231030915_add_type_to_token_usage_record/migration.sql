/*
  Warnings:

  - The values [INITIAL] on the enum `TokenConsumedType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TokenConsumedType_new" AS ENUM ('EXCHANGE', 'CONSUME', 'REWARD');
ALTER TABLE "TokenUsageRecord" ALTER COLUMN "type" TYPE "TokenConsumedType_new" USING ("type"::text::"TokenConsumedType_new");
ALTER TYPE "TokenConsumedType" RENAME TO "TokenConsumedType_old";
ALTER TYPE "TokenConsumedType_new" RENAME TO "TokenConsumedType";
DROP TYPE "TokenConsumedType_old";
COMMIT;

-- AlterTable
ALTER TABLE "TokenUsageRecord" ADD COLUMN     "imgUrl" TEXT,
ADD COLUMN     "result" JSONB;
