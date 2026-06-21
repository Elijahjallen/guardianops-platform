-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "arrivalAirport" TEXT,
ADD COLUMN     "assignedEscortId" TEXT,
ADD COLUMN     "departureAirport" TEXT,
ADD COLUMN     "scheduledDropoffTime" TIMESTAMP(3),
ADD COLUMN     "scheduledPickupTime" TIMESTAMP(3),
ADD COLUMN     "schedulingStatus" TEXT DEFAULT 'Not Scheduled';
