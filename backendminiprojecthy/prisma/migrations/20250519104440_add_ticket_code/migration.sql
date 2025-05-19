/*
  Warnings:

  - A unique constraint covering the columns `[ticket_code]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ticket_code` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "ticket_code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_ticket_code_key" ON "Transaction"("ticket_code");
