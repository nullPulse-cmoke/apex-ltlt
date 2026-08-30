/*
  Warnings:

  - You are about to drop the `Reward` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RewardClaim` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "lastLoginAt" DATETIME;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Reward";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RewardClaim";
PRAGMA foreign_keys=on;
