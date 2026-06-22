-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MediaItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'video',
    "category" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL DEFAULT '',
    "fileUrl" TEXT,
    "thumbnailUrl" TEXT,
    "publishedAt" DATETIME,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_MediaItem" ("category", "createdAt", "id", "isActive", "isNew", "publishedAt", "sortOrder", "thumbnailUrl", "title", "updatedAt", "videoUrl") SELECT "category", "createdAt", "id", "isActive", "isNew", "publishedAt", "sortOrder", "thumbnailUrl", "title", "updatedAt", "videoUrl" FROM "MediaItem";
DROP TABLE "MediaItem";
ALTER TABLE "new_MediaItem" RENAME TO "MediaItem";
CREATE INDEX "MediaItem_category_idx" ON "MediaItem"("category");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
