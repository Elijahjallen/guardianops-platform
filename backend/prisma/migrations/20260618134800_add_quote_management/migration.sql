-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "quoteAmount" DOUBLE PRECISION,
ADD COLUMN     "quoteApprovedDate" TIMESTAMP(3),
ADD COLUMN     "quoteSentDate" TIMESTAMP(3),
ADD COLUMN     "quoteStatus" TEXT DEFAULT 'Pending';
