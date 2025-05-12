/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `isFree` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `couponId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `finalAmount` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `midtransOrderId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `midtransToken` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `paymentProof` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `pointId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `pointsUsed` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `voucherId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `TicketPurchase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TicketType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `total_price` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TicketPurchase" DROP CONSTRAINT "TicketPurchase_ticketTypeId_fkey";

-- DropForeignKey
ALTER TABLE "TicketPurchase" DROP CONSTRAINT "TicketPurchase_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "TicketType" DROP CONSTRAINT "TicketType_event_id_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_couponId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pointId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_voucherId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "imageUrl",
DROP COLUMN "isFree";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "couponId",
DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "finalAmount",
DROP COLUMN "midtransOrderId",
DROP COLUMN "midtransToken",
DROP COLUMN "paymentMethod",
DROP COLUMN "paymentProof",
DROP COLUMN "pointId",
DROP COLUMN "pointsUsed",
DROP COLUMN "totalAmount",
DROP COLUMN "updatedAt",
DROP COLUMN "voucherId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "payment_proof" TEXT,
ADD COLUMN     "total_price" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "used_coupon_id" INTEGER,
ADD COLUMN     "used_point" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "used_voucher_id" INTEGER;

-- DropTable
DROP TABLE "TicketPurchase";

-- DropTable
DROP TABLE "TicketType";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_used_voucher_id_fkey" FOREIGN KEY ("used_voucher_id") REFERENCES "Voucher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_used_coupon_id_fkey" FOREIGN KEY ("used_coupon_id") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
