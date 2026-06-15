import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { AuthRequest, requireAuth } from "../middleware/authMiddleware";

const router = Router();
const prisma = new PrismaClient();

router.get("/cases", requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user?.userId,
      },
      select: {
        role: true,
        clientName: true,
      },
    });

    if (!user || !["Parent", "Client"].includes(user.role)) {
      return res.status(403).json({ message: "Parent or Client access required" });
    }

    if (!user.clientName) {
      return res.json([]);
    }

    const cases = await prisma.case.findMany({
      where: {
        clientName: user.clientName,
      },
      orderBy: {
        pickupDate: "desc",
      },
    });

    res.json(cases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load parent cases" });
  }
});

export default router;