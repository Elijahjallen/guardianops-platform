import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  try {
    const {
      clientName,
      firstName,
      middleName,
      lastName,
      preferredName,
      dateOfBirth,
      gender,
      identifiesNonBinary,
      identifiesTransgender,
      pronouns,
      autismSpectrumDisorder,
      autismSpectrumLevel,
      height,
      weight,
      hairColor,
      eyeColor,
      marks,
      likes,
      dislikes,
      participatingBehavior,
      impulsiveBehavior,
      siblingsInHome,
      familyDynamics,
      bedroomLayout,
      sportsOrHobbies,
      athleticLevel,
      custody,
      biologicalOrAdopted,
    } = req.body;

    if (!clientName || !firstName || !lastName || !dateOfBirth || !gender) {
      return res.status(400).json({
        message:
          "Client name, first name, last name, date of birth, and gender are required.",
      });
    }

    const parsedDateOfBirth = new Date(dateOfBirth);

    if (Number.isNaN(parsedDateOfBirth.getTime())) {
      return res.status(400).json({
        message: "Invalid date of birth.",
      });
    }

    const caseNumber = `CASE-${Date.now()}`;

    const newCase = await prisma.case.create({
      data: {
        caseNumber,
        clientName,
        status: "Pending",
        destination: "Pending",
        pickupDate: new Date(),
        staffName: null,
      },
    });

    const youthProfile = await prisma.youthProfile.create({
      data: {
        caseId: newCase.id,
        caseNumber,

        firstName,
        middleName: middleName || null,
        lastName,
        preferredName: preferredName || null,

        dateOfBirth: parsedDateOfBirth,

        gender,
        identifiesNonBinary: Boolean(identifiesNonBinary),
        identifiesTransgender: Boolean(identifiesTransgender),
        pronouns: pronouns || null,

        autismSpectrumDisorder: Boolean(autismSpectrumDisorder),
        autismSpectrumLevel: autismSpectrumLevel || null,

        height: height || null,
        weight: weight || null,
        hairColor: hairColor || null,
        eyeColor: eyeColor || null,
        marks: marks || null,

        likes: likes || null,
        dislikes: dislikes || null,
        participatingBehavior: participatingBehavior || null,
        impulsiveBehavior: impulsiveBehavior || null,

        siblingsInHome: siblingsInHome || null,
        familyDynamics: familyDynamics || null,
        bedroomLayout: bedroomLayout || null,

        sportsOrHobbies: sportsOrHobbies || null,
        athleticLevel: athleticLevel || null,

        custody: custody || null,
        biologicalOrAdopted: biologicalOrAdopted || null,
      },
    });

    await prisma.caseActivity.create({
      data: {
        caseId: newCase.id,
        caseNumber,
        title: "Intake Submitted",
        description: `A new intake form was submitted for ${firstName} ${lastName}.`,
        createdBy: "System",
      },
    });

    await prisma.notification.create({
      data: {
        title: "New Intake Submitted",
        message: `New pending case ${caseNumber} submitted for ${firstName} ${lastName}.`,
        severity: "Info",
      },
    });

    res.status(201).json({
      success: true,
      caseId: newCase.id,
      caseNumber,
      status: "Pending",
      youthProfile,
    });
  } catch (error) {
    console.error("Failed to create intake case:", error);

    res.status(500).json({
      message: "Failed to create intake case",
    });
  }
});

router.get("/youth-profile/:caseId", async (req, res) => {
  try {
    const youthProfile = await prisma.youthProfile.findUnique({
      where: {
        caseId: String(req.params.caseId),
      },
    });

    if (!youthProfile) {
      return res.status(404).json({
        message: "Youth profile not found",
      });
    }

    res.json(youthProfile);
  } catch (error) {
    console.error("Failed to load youth profile:", error);

    res.status(500).json({
      message: "Failed to load youth profile",
    });
  }
});

export default router;