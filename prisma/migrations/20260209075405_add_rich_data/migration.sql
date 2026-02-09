-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "color" TEXT,
ADD COLUMN     "creator" TEXT,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "licenseUrl" TEXT;

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "rating" INTEGER,
    "date" TIMESTAMP(3),
    "movieId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
