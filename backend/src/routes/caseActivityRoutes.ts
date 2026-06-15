import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { AuthRequest, requireAuth } from "../middleware/authMiddleware";

const router = Router();
const prisma = new PrismaClient();

router.get("/:caseId", requireAuth, async (req: AuthRequest, res) => {
  try {
    const activities = await prisma.caseActivity.findMany({
      where: {
        caseId: req.params.caseId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load case activity" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const activity = await prisma.caseActivity.create({
      data: {
        caseId: req.body.caseId,
        caseNumber: req.body.caseNumber,
        title: req.body.title,
        description: req.body.description,
        createdBy: req.body.createdBy || req.user?.userId || "System",
      },
    });

    res.status(201).json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create case activity" });
  }
});

export default router;