-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "strainName" TEXT,
    "description" TEXT,
    "videoUrl" TEXT,
    "artworkUrl" TEXT,
    "productImageUrl" TEXT,
    "ingredients" TEXT,
    "warningText" TEXT,
    "socialLinks" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNUSED',
    "firstScannedAt" DATETIME,
    "scanCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VerificationCode_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ScanEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "deviceType" TEXT NOT NULL DEFAULT 'OTHER',
    "userAgent" TEXT,
    "isFirstScan" BOOLEAN NOT NULL DEFAULT false,
    "scannedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ScanEvent_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "VerificationCode" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ScanEvent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmailCapture" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "productId" TEXT,
    "capturedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmailCapture_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCode_code_key" ON "VerificationCode"("code");

-- CreateIndex
CREATE INDEX "VerificationCode_code_idx" ON "VerificationCode"("code");

-- CreateIndex
CREATE INDEX "VerificationCode_productId_idx" ON "VerificationCode"("productId");

-- CreateIndex
CREATE INDEX "ScanEvent_codeId_idx" ON "ScanEvent"("codeId");

-- CreateIndex
CREATE INDEX "ScanEvent_productId_idx" ON "ScanEvent"("productId");

-- CreateIndex
CREATE INDEX "EmailCapture_productId_idx" ON "EmailCapture"("productId");
