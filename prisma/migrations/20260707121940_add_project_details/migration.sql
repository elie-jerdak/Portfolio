-- AlterTable
ALTER TABLE "Projects" ADD COLUMN     "category" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "technologies" TEXT[];
