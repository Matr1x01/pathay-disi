/*
  Warnings:

  - You are about to drop the column `stataus` on the `roles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "roles" DROP COLUMN "stataus",
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;
