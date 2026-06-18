-- AlterTable
ALTER TABLE "EmailCapture" ADD COLUMN "phone" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "size" TEXT DEFAULT '2G';
ALTER TABLE "Product" ADD COLUMN "sku" TEXT;
