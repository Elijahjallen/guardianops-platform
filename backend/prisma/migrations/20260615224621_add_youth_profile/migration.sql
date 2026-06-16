-- CreateTable
CREATE TABLE "YouthProfile" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "preferredName" TEXT,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "identifiesNonBinary" BOOLEAN NOT NULL DEFAULT false,
    "identifiesTransgender" BOOLEAN NOT NULL DEFAULT false,
    "pronouns" TEXT,
    "autismSpectrumDisorder" BOOLEAN NOT NULL DEFAULT false,
    "autismSpectrumLevel" TEXT,
    "height" TEXT,
    "weight" TEXT,
    "hairColor" TEXT,
    "eyeColor" TEXT,
    "marks" TEXT,
    "likes" TEXT,
    "dislikes" TEXT,
    "participatingBehavior" TEXT,
    "impulsiveBehavior" TEXT,
    "siblingsInHome" TEXT,
    "familyDynamics" TEXT,
    "bedroomLayout" TEXT,
    "sportsOrHobbies" TEXT,
    "athleticLevel" TEXT,
    "custody" TEXT,
    "biologicalOrAdopted" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YouthProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "YouthProfile_caseId_key" ON "YouthProfile"("caseId");
