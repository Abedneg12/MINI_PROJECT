/*
  Warnings:

  - The primary key for the `Coupon` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Coupon` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Point` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Point` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ReferralLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ReferralLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Review` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `used_voucher_id` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `used_coupon_id` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Voucher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Voucher` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `user_id` on the `Coupon` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `organizer_id` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `Point` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `referred_by_id` on the `ReferralLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `referral_used_id` on the `ReferralLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `transaction_id` on the `Review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `event_id` on the `Review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `event_id` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `event_id` on the `Voucher` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Coupon" DROP CONSTRAINT "Coupon_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_organizer_id_fkey";

-- DropForeignKey
ALTER TABLE "Point" DROP CONSTRAINT "Point_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ReferralLog" DROP CONSTRAINT "ReferralLog_referral_used_id_fkey";

-- DropForeignKey
ALTER TABLE "ReferralLog" DROP CONSTRAINT "ReferralLog_referred_by_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_event_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_event_id_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_used_coupon_id_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_used_voucher_id_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Voucher" DROP CONSTRAINT "Voucher_event_id_fkey";

-- AlterTable
ALTER TABLE "Coupon" DROP CONSTRAINT "Coupon_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "organizer_id",
ADD COLUMN     "organizer_id" INTEGER NOT NULL,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Point" DROP CONSTRAINT "Point_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "Point_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ReferralLog" DROP CONSTRAINT "ReferralLog_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "referred_by_id",
ADD COLUMN     "referred_by_id" INTEGER NOT NULL,
DROP COLUMN "referral_used_id",
ADD COLUMN     "referral_used_id" INTEGER NOT NULL,
ADD CONSTRAINT "ReferralLog_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Review" DROP CONSTRAINT "Review_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "transaction_id",
ADD COLUMN     "transaction_id" INTEGER NOT NULL,
DROP COLUMN "event_id",
ADD COLUMN     "event_id" INTEGER NOT NULL,
ADD CONSTRAINT "Review_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
DROP COLUMN "event_id",
ADD COLUMN     "event_id" INTEGER NOT NULL,
DROP COLUMN "used_voucher_id",
ADD COLUMN     "used_voucher_id" INTEGER,
DROP COLUMN "used_coupon_id",
ADD COLUMN     "used_coupon_id" INTEGER,
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Voucher" DROP CONSTRAINT "Voucher_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "event_id",
ADD COLUMN     "event_id" INTEGER NOT NULL,
ADD CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Review_transaction_id_key" ON "Review"("transaction_id");

-- AddForeignKey
ALTER TABLE "ReferralLog" ADD CONSTRAINT "ReferralLog_referred_by_id_fkey" FOREIGN KEY ("referred_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralLog" ADD CONSTRAINT "ReferralLog_referral_used_id_fkey" FOREIGN KEY ("referral_used_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_used_voucher_id_fkey" FOREIGN KEY ("used_voucher_id") REFERENCES "Voucher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_used_coupon_id_fkey" FOREIGN KEY ("used_coupon_id") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Point" ADD CONSTRAINT "Point_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
