-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "airlineName" TEXT,
ADD COLUMN     "flightArrival" TIMESTAMP(3),
ADD COLUMN     "flightDeparture" TIMESTAMP(3),
ADD COLUMN     "flightNumber" TEXT,
ADD COLUMN     "hotelCheckIn" TIMESTAMP(3),
ADD COLUMN     "hotelCheckOut" TIMESTAMP(3),
ADD COLUMN     "hotelName" TEXT,
ADD COLUMN     "rentalCarCompany" TEXT,
ADD COLUMN     "rentalConfirmation" TEXT;
