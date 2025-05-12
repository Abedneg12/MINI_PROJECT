-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "image_url" TEXT,
ALTER COLUMN "paid" SET DEFAULT false,
ALTER COLUMN "updated_at" DROP DEFAULT;
