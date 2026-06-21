import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { generateCaseSummary } from "../services/aiSummaryService";

const router = Router();
const prisma = new PrismaClient();

async function generateCaseNumber() {
  const currentYear = new Date().getFullYear().toString();

  const latestCase = await prisma.case.findFirst({
    where: {
      caseNumber: {
        startsWith: `${currentYear}-`,
      },
    },
    orderBy: {
      caseNumber: "desc",
    },
  });

  let nextSequence = 0;

  if (latestCase) {
    const lastSequence = parseInt(latestCase.caseNumber.split("-")[1], 10);

    if (!Number.isNaN(lastSequence)) {
      nextSequence = lastSequence + 1;
    }
  }

  return `${currentYear}-${String(nextSequence).padStart(5, "0")}`;
}

async function createNotification(
  title: string,
  message: string,
  severity = "Info"
) {
  await prisma.notification.create({
    data: {
      title,
      message,
      severity,
    },
  });
}

async function createAuditLog(
  caseId: string,
  caseNumber: string,
  action: string,
  description: string,
  performedBy = "System",
  oldValue?: string,
  newValue?: string
) {
  await prisma.auditLog.create({
    data: {
      caseId,
      caseNumber,
      action,
      entityType: "Case",
      entityId: caseId,
      description,
      performedBy,
      oldValue,
      newValue,
    },
  });
}

function parseNumberOrNull(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return Number(value);
}

function parseDateOrNull(value: unknown) {
  if (!value || typeof value !== "string") {
    return null;
  }

  return new Date(value);
}

function calculateTotalExpense(body: any) {
  return (
    (parseNumberOrNull(body.flightCost) || 0) +
    (parseNumberOrNull(body.hotelCost) || 0) +
    (parseNumberOrNull(body.mealCost) || 0) +
    (parseNumberOrNull(body.groundCost) || 0) +
    (parseNumberOrNull(body.otherCost) || 0)
  );
}

router.get("/", async (_req, res) => {
  try {
    const cases = await prisma.case.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(cases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch cases" });
  }
});

router.get("/debug/all", async (_req, res) => {
  const cases = await prisma.case.findMany({
    select: {
      id: true,
      caseNumber: true,
      clientName: true,
    },
  });

  res.json(cases);
});

router.get("/debug/all", async (_req, res) => {
  const cases = await prisma.case.findMany({
    select: {
      id: true,
      caseNumber: true,
      clientName: true,
    },
  });

  res.json(cases);
});

router.get("/", async (_req, res) => {
  // existing get all cases code
});

router.get("/debug/all", async (_req, res) => {
  const cases = await prisma.case.findMany({
    select: {
      id: true,
      caseNumber: true,
      clientName: true,
    },
  });

  res.json(cases);
});

router.get("/:id", async (req, res) => {
  try {
    const idOrCaseNumber = String(req.params.id).trim();

    console.log("Looking up case:", idOrCaseNumber);

    const caseItem = await prisma.case.findFirst({
      where: {
        OR: [{ id: idOrCaseNumber }, { caseNumber: idOrCaseNumber }],
      },
    });

    if (!caseItem) {
      console.log("No case found for:", idOrCaseNumber);
      return res.status(404).json({ error: "Case not found" });
    }

    res.json(caseItem);
  } catch (error) {
    console.error("Failed to fetch case:", error);
    res.status(500).json({ error: "Failed to fetch case" });
  }
});

router.post("/", async (req, res) => {
  try {
    const caseNumber = await generateCaseNumber();

    const newCase = await prisma.case.create({
      data: {
        caseNumber,
        clientName: req.body.clientName,
        status: req.body.status || "Pending",
        destination: req.body.destination || "Pending",
        pickupDate: req.body.pickupDate
          ? new Date(req.body.pickupDate)
          : new Date(),
        staffName: req.body.staffName || null,

        assignedCaseManager: req.body.assignedCaseManager || null,
        assignedFieldStaff: req.body.assignedFieldStaff || null,
        transportDate: parseDateOrNull(req.body.transportDate),
        pickupLocation: req.body.pickupLocation || null,
        destinationLocation: req.body.destinationLocation || null,
        travelBooked: Boolean(req.body.travelBooked),
        flightConfirmation: req.body.flightConfirmation || null,
        hotelConfirmation: req.body.hotelConfirmation || null,
        casePriority: req.body.casePriority || "Standard",

        quoteAmount: parseNumberOrNull(req.body.quoteAmount),
        quoteStatus: req.body.quoteStatus || "Pending",
        quoteSentDate: parseDateOrNull(req.body.quoteSentDate),
        quoteApprovedDate: parseDateOrNull(req.body.quoteApprovedDate),

        scheduledPickupTime: parseDateOrNull(req.body.scheduledPickupTime),
        scheduledDropoffTime: parseDateOrNull(req.body.scheduledDropoffTime),
        departureAirport: req.body.departureAirport || null,
        arrivalAirport: req.body.arrivalAirport || null,
        assignedEscortId: req.body.assignedEscortId || null,
        schedulingStatus: req.body.schedulingStatus || "Not Scheduled",

        airlineName: req.body.airlineName || null,
        flightNumber: req.body.flightNumber || null,
        flightDeparture: parseDateOrNull(req.body.flightDeparture),
        flightArrival: parseDateOrNull(req.body.flightArrival),
        hotelName: req.body.hotelName || null,
        hotelCheckIn: parseDateOrNull(req.body.hotelCheckIn),
        hotelCheckOut: parseDateOrNull(req.body.hotelCheckOut),
        rentalCarCompany: req.body.rentalCarCompany || null,
        rentalConfirmation: req.body.rentalConfirmation || null,

        flightCost: parseNumberOrNull(req.body.flightCost),
        hotelCost: parseNumberOrNull(req.body.hotelCost),
        mealCost: parseNumberOrNull(req.body.mealCost),
        groundCost: parseNumberOrNull(req.body.groundCost),
        otherCost: parseNumberOrNull(req.body.otherCost),
        totalExpense: calculateTotalExpense(req.body),
      },
    });

    await prisma.caseActivity.create({
      data: {
        caseId: newCase.id,
        caseNumber: newCase.caseNumber,
        title: "Case Created",
        description: `Case ${newCase.caseNumber} was created for ${newCase.clientName}.`,
        createdBy: "System",
      },
    });

    await createAuditLog(
      newCase.id,
      newCase.caseNumber,
      "CASE_CREATED",
      `Case ${newCase.caseNumber} was created for ${newCase.clientName}.`
    );

    await createNotification(
      "Case Created",
      `Case ${newCase.caseNumber} was created for ${newCase.clientName}.`,
      "Info"
    );

    res.status(201).json(newCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create case" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const existingCase = await prisma.case.findUnique({
      where: {
        id: String(req.params.id),
      },
    });

    if (!existingCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    const updatedCase = await prisma.case.update({
      where: {
        id: String(req.params.id),
      },
      data: {
        caseNumber: existingCase.caseNumber,
        clientName: req.body.clientName,
        status: req.body.status,
        destination: req.body.destination,
        pickupDate: req.body.pickupDate
          ? new Date(req.body.pickupDate)
          : undefined,
        staffName: req.body.staffName || null,

        assignedCaseManager: req.body.assignedCaseManager || null,
        assignedFieldStaff: req.body.assignedFieldStaff || null,
        transportDate: parseDateOrNull(req.body.transportDate),
        pickupLocation: req.body.pickupLocation || null,
        destinationLocation: req.body.destinationLocation || null,
        travelBooked: Boolean(req.body.travelBooked),
        flightConfirmation: req.body.flightConfirmation || null,
        hotelConfirmation: req.body.hotelConfirmation || null,
        casePriority: req.body.casePriority || "Standard",

        quoteAmount: parseNumberOrNull(req.body.quoteAmount),
        quoteStatus: req.body.quoteStatus || "Pending",
        quoteSentDate: parseDateOrNull(req.body.quoteSentDate),
        quoteApprovedDate: parseDateOrNull(req.body.quoteApprovedDate),

        scheduledPickupTime: parseDateOrNull(req.body.scheduledPickupTime),
        scheduledDropoffTime: parseDateOrNull(req.body.scheduledDropoffTime),
        departureAirport: req.body.departureAirport || null,
        arrivalAirport: req.body.arrivalAirport || null,
        assignedEscortId: req.body.assignedEscortId || null,
        schedulingStatus: req.body.schedulingStatus || "Not Scheduled",

        airlineName: req.body.airlineName || null,
        flightNumber: req.body.flightNumber || null,
        flightDeparture: parseDateOrNull(req.body.flightDeparture),
        flightArrival: parseDateOrNull(req.body.flightArrival),
        hotelName: req.body.hotelName || null,
        hotelCheckIn: parseDateOrNull(req.body.hotelCheckIn),
        hotelCheckOut: parseDateOrNull(req.body.hotelCheckOut),
        rentalCarCompany: req.body.rentalCarCompany || null,
        rentalConfirmation: req.body.rentalConfirmation || null,

        flightCost: parseNumberOrNull(req.body.flightCost),
        hotelCost: parseNumberOrNull(req.body.hotelCost),
        mealCost: parseNumberOrNull(req.body.mealCost),
        groundCost: parseNumberOrNull(req.body.groundCost),
        otherCost: parseNumberOrNull(req.body.otherCost),
        totalExpense: calculateTotalExpense(req.body),
      },
    });

    if (existingCase.status !== updatedCase.status) {
      await prisma.caseActivity.create({
        data: {
          caseId: updatedCase.id,
          caseNumber: updatedCase.caseNumber,
          title: "Status Updated",
          description: `Status changed from ${existingCase.status} to ${updatedCase.status}.`,
          createdBy: "System",
        },
      });

      await createAuditLog(
        updatedCase.id,
        updatedCase.caseNumber,
        "STATUS_UPDATED",
        `Status changed from ${existingCase.status} to ${updatedCase.status}.`,
        "System",
        existingCase.status,
        updatedCase.status
      );
    }

    if (existingCase.quoteStatus !== updatedCase.quoteStatus) {
      await prisma.caseActivity.create({
        data: {
          caseId: updatedCase.id,
          caseNumber: updatedCase.caseNumber,
          title: "Quote Status Updated",
          description: `Quote status changed from ${
            existingCase.quoteStatus || "Pending"
          } to ${updatedCase.quoteStatus || "Pending"}.`,
          createdBy: "System",
        },
      });

      await createAuditLog(
        updatedCase.id,
        updatedCase.caseNumber,
        "QUOTE_UPDATED",
        `Quote status changed from ${
          existingCase.quoteStatus || "Pending"
        } to ${updatedCase.quoteStatus || "Pending"}.`,
        "System",
        existingCase.quoteStatus || "",
        updatedCase.quoteStatus || ""
      );
    }

    if (existingCase.totalExpense !== updatedCase.totalExpense) {
      await prisma.caseActivity.create({
        data: {
          caseId: updatedCase.id,
          caseNumber: updatedCase.caseNumber,
          title: "Expense Summary Updated",
          description: `Total expenses changed from ${
            existingCase.totalExpense ?? 0
          } to ${updatedCase.totalExpense ?? 0}.`,
          createdBy: "System",
        },
      });

      await createAuditLog(
        updatedCase.id,
        updatedCase.caseNumber,
        "EXPENSE_UPDATED",
        "Expense totals were updated.",
        "System",
        String(existingCase.totalExpense || 0),
        String(updatedCase.totalExpense || 0)
      );
    }

    if (existingCase.schedulingStatus !== updatedCase.schedulingStatus) {
      await prisma.caseActivity.create({
        data: {
          caseId: updatedCase.id,
          caseNumber: updatedCase.caseNumber,
          title: "Scheduling Status Updated",
          description: `Scheduling status changed from ${
            existingCase.schedulingStatus || "Not Scheduled"
          } to ${updatedCase.schedulingStatus || "Not Scheduled"}.`,
          createdBy: "System",
        },
      });

      await createAuditLog(
        updatedCase.id,
        updatedCase.caseNumber,
        "SCHEDULING_UPDATED",
        `Scheduling changed from ${
          existingCase.schedulingStatus || "Not Scheduled"
        } to ${updatedCase.schedulingStatus || "Not Scheduled"}.`,
        "System",
        existingCase.schedulingStatus || "",
        updatedCase.schedulingStatus || ""
      );
    }

    if (existingCase.assignedEscortId !== updatedCase.assignedEscortId) {
      await prisma.caseActivity.create({
        data: {
          caseId: updatedCase.id,
          caseNumber: updatedCase.caseNumber,
          title: "Escort Assignment Updated",
          description: `Assigned escort changed from ${
            existingCase.assignedEscortId || "Unassigned"
          } to ${updatedCase.assignedEscortId || "Unassigned"}.`,
          createdBy: "System",
        },
      });

      await createAuditLog(
        updatedCase.id,
        updatedCase.caseNumber,
        "ESCORT_UPDATED",
        "Assigned escort was updated.",
        "System",
        existingCase.assignedEscortId || "",
        updatedCase.assignedEscortId || ""
      );
    }

    await createAuditLog(
      updatedCase.id,
      updatedCase.caseNumber,
      "CASE_UPDATED",
      `Case ${updatedCase.caseNumber} was updated.`
    );

    res.json(updatedCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update case" });
  }
});

router.post("/:id/ai-summary", async (req, res) => {
  try {
    const existingCase = await prisma.case.findUnique({
      where: {
        id: String(req.params.id),
      },
    });

    if (!existingCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    const summary = await generateCaseSummary(existingCase);

    const updatedCase = await prisma.case.update({
      where: {
        id: String(req.params.id),
      },
      data: {
        aiSummary: summary,
      },
    });

    await prisma.caseActivity.create({
      data: {
        caseId: updatedCase.id,
        caseNumber: updatedCase.caseNumber,
        title: "AI Summary Generated",
        description: `AI case summary was generated for ${updatedCase.clientName}.`,
        createdBy: req.body.createdBy || "System",
      },
    });

    await createAuditLog(
      updatedCase.id,
      updatedCase.caseNumber,
      "AI_SUMMARY_GENERATED",
      "AI case summary was generated.",
      req.body.createdBy || "System"
    );

    await createNotification(
      "AI Summary Generated",
      `AI summary generated for case ${updatedCase.caseNumber}.`,
      "Info"
    );

    res.json(updatedCase);
  } catch (error) {
    console.error("AI summary error:", error);
    res.status(500).json({ error: "Failed to generate AI summary" });
  }
});

router.put("/:id/approve-quote", async (req, res) => {
  try {
    const existingCase = await prisma.case.findUnique({
      where: {
        id: String(req.params.id),
      },
    });

    if (!existingCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    const updatedCase = await prisma.case.update({
      where: {
        id: String(req.params.id),
      },
      data: {
        quoteStatus: "Approved",
        quoteApprovedDate: new Date(),
      },
    });

    await prisma.caseActivity.create({
      data: {
        caseId: updatedCase.id,
        caseNumber: updatedCase.caseNumber,
        title: "Quote Approved",
        description: `Quote was approved for ${updatedCase.clientName}.`,
        createdBy: req.body.createdBy || "System",
      },
    });

    await createAuditLog(
      updatedCase.id,
      updatedCase.caseNumber,
      "QUOTE_APPROVED",
      "Quote approved.",
      req.body.createdBy || "System",
      existingCase.quoteStatus || "",
      "Approved"
    );

    await createNotification(
      "Quote Approved",
      `Quote for case ${updatedCase.caseNumber} was approved.`,
      "Info"
    );

    res.json(updatedCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to approve quote" });
  }
});

router.put("/:id/decline-quote", async (req, res) => {
  try {
    const existingCase = await prisma.case.findUnique({
      where: {
        id: String(req.params.id),
      },
    });

    if (!existingCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    const updatedCase = await prisma.case.update({
      where: {
        id: String(req.params.id),
      },
      data: {
        quoteStatus: "Declined",
        quoteApprovedDate: null,
      },
    });

    await prisma.caseActivity.create({
      data: {
        caseId: updatedCase.id,
        caseNumber: updatedCase.caseNumber,
        title: "Quote Declined",
        description: `Quote was declined for ${updatedCase.clientName}.`,
        createdBy: req.body.createdBy || "System",
      },
    });

    await createAuditLog(
      updatedCase.id,
      updatedCase.caseNumber,
      "QUOTE_DECLINED",
      "Quote declined.",
      req.body.createdBy || "System",
      existingCase.quoteStatus || "",
      "Declined"
    );

    await createNotification(
      "Quote Declined",
      `Quote for case ${updatedCase.caseNumber} was declined.`,
      "High"
    );

    res.json(updatedCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to decline quote" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const existingCase = await prisma.case.findUnique({
      where: {
        id: String(req.params.id),
      },
    });

    if (existingCase) {
      await createAuditLog(
        existingCase.id,
        existingCase.caseNumber,
        "CASE_DELETED",
        `Case ${existingCase.caseNumber} was deleted.`
      );
    }

    await prisma.caseActivity.deleteMany({
      where: {
        caseId: String(req.params.id),
      },
    });

    await prisma.case.delete({
      where: {
        id: String(req.params.id),
      },
    });

    res.json({ message: "Case deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete case" });
  }
});

export default router;