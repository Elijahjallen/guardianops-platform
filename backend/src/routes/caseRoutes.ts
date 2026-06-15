import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

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

router.get("/:id", async (req, res) => {
  try {
    const caseItem = await prisma.case.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!caseItem) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.json(caseItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch case" });
  }
});

async function createNotification(title: string, message: string, severity = "Info") {
  await prisma.notification.create({
    data: {
      title,
      message,
      severity,
    },
  });
}

router.post("/", async (req, res) => {
  try {
    const newCase = await prisma.case.create({
      data: {
        caseNumber: req.body.caseNumber,
        clientName: req.body.clientName,
        status: req.body.status,
        destination: req.body.destination,
        pickupDate: new Date(req.body.pickupDate),
        staffName: req.body.staffName,
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

    await createNotification(
      "Case Created",
      `Case ${newCase.caseNumber} was created for ${newCase.clientName}.`,
      "Info"
    );

    if (newCase.staffName) {
      await prisma.caseActivity.create({
        data: {
          caseId: newCase.id,
          caseNumber: newCase.caseNumber,
          title: "Escort Assigned",
          description: `${newCase.staffName} was assigned to case ${newCase.caseNumber}.`,
          createdBy: "System",
        },
      });

      await createNotification(
        "Escort Assigned",
        `${newCase.staffName} was assigned to case ${newCase.caseNumber}.`,
        "Medium"
      );
    }

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
        id: req.params.id,
      },
    });

    if (!existingCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    const updatedCase = await prisma.case.update({
      where: {
        id: req.params.id,
      },
      data: {
        caseNumber: req.body.caseNumber,
        clientName: req.body.clientName,
        status: req.body.status,
        destination: req.body.destination,
        pickupDate: req.body.pickupDate
          ? new Date(req.body.pickupDate)
          : undefined,
        staffName: req.body.staffName,
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

      await createNotification(
        "Status Updated",
        `Case ${updatedCase.caseNumber} status changed from ${existingCase.status} to ${updatedCase.status}.`,
        updatedCase.status === "Cancelled" ? "High" : "Info"
      );
    }

    if (existingCase.staffName !== updatedCase.staffName) {
      await prisma.caseActivity.create({
        data: {
          caseId: updatedCase.id,
          caseNumber: updatedCase.caseNumber,
          title: "Escort Assignment Updated",
          description: `Escort changed from ${
            existingCase.staffName || "Unassigned"
          } to ${updatedCase.staffName || "Unassigned"}.`,
          createdBy: "System",
        },
      });

      await createNotification(
        "Escort Assignment Updated",
        `Case ${updatedCase.caseNumber} escort changed from ${
          existingCase.staffName || "Unassigned"
        } to ${updatedCase.staffName || "Unassigned"}.`,
        "Medium"
      );
    }

    res.json(updatedCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update case" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.caseActivity.deleteMany({
      where: {
        caseId: req.params.id,
      },
    });

    await prisma.case.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({ message: "Case deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete case" });
  }
});

export default router;