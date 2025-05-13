/*
  Warnings:

  - You are about to drop the column `discount_type` on the `Voucher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Voucher" DROP COLUMN "discount_type",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
