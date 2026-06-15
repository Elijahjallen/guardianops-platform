import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { AuthRequest, requireAuth } from "../middleware/authMiddleware";

const router = Router();
const prisma = new PrismaClient();

router.get("/:caseId", requireAuth, async (req: AuthRequest, res) => {
  try {
    const messages = await prisma.message.findMany({
where: {
  caseId: String(req.params.caseId),
},
      orderBy: {
        createdAt: "asc",
      },
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load messages" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user?.userId,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const newMessage = await prisma.message.create({
      data: {
        caseId: req.body.caseId,
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role,
        content: req.body.content,
      },
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

export default router;