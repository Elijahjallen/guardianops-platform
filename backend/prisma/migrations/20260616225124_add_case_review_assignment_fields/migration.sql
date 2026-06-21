-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "assignedCaseManager" TEXT,
ADD COLUMN     "assignedFieldStaff" TEXT,
ADD COLUMN     "casePriority" TEXT NOT NULL DEFAULT 'Standard',
ADD COLUMN     "destinationLocation" TEXT,
ADD COLUMN     "flightConfirmation" TEXT,
ADD COLUMN     "hotelConfirmation" TEXT,
ADD COLUMN     "pickupLocation" TEXT,
ADD COLUMN     "transportDate" TIMESTAMP(3),
ADD COLUMN     "travelBooked" BOOLEAN NOT NULL DEFAULT false;
