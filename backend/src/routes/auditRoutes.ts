import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (_req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 500,
    });

    res.json(logs);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load audit logs",
    });
  }
});

router.get("/case/:caseId", async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      where: {
        caseId: req.params.caseId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(logs);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load case audit history",
    });
  }
});

export default router;