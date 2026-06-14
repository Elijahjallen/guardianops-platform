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

    res.status(201).json(newCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create case" });
  }
});

router.put("/:id", async (req, res) => {
  try {
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

    res.json(updatedCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update case" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
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