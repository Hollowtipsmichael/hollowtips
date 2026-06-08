-- AlterTable
ALTER TABLE "Product" ADD COLUMN "productType" TEXT;

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "strainName" TEXT,
    "productType" TEXT,
    "artworkUrl" TEXT,
    "productImageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VerificationCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'UNUSED',
    "firstScannedAt" DATETIME,
    "scanCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VerificationCode_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VerificationCode_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_VerificationCode" ("code", "createdAt", "firstScannedAt", "id", "productId", "scanCount", "status") SELECT "code", "createdAt", "firstScannedAt", "id", "productId", "scanCount", "status" FROM "VerificationCode";
DROP TABLE "VerificationCode";
ALTER TABLE "new_VerificationCode" RENAME TO "VerificationCode";
CREATE UNIQUE INDEX "VerificationCode_code_key" ON "VerificationCode"("code");
CREATE INDEX "VerificationCode_code_idx" ON "VerificationCode"("code");
CREATE INDEX "VerificationCode_productId_idx" ON "VerificationCode"("productId");
CREATE INDEX "VerificationCode_variantId_idx" ON "VerificationCode"("variantId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");
