/*
  Warnings:

  - Added the required column `age` to the `UserHealth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `UserHealth` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "UserHealth" ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL;
