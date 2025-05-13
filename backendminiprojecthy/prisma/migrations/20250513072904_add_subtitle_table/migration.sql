/*
  Warnings:

  - You are about to drop the column `created_at` on the `Voucher` table. All the data in the column will be lost.
  - Added the required column `subtitle` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount_type` to the `Voucher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "subtitle" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Voucher" DROP COLUMN "created_at",
ADD COLUMN     "discount_type" TEXT NOT NULL;
