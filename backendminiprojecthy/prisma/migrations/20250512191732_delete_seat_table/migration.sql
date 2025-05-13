/*
  Warnings:

  - You are about to drop the `Seat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_ticket_id_fkey";

-- DropTable
DROP TABLE "Seat";
