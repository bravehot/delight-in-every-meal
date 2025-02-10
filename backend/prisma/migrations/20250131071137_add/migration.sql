/*
  Warnings:

  - You are about to drop the column `bmr` on the `UserHealth` table. All the data in the column will be lost.
  - Added the required column `tdee` to the `UserHealth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserHealth" DROP COLUMN "bmr",
ADD COLUMN     "tdee" DOUBLE PRECISION NOT NULL;
