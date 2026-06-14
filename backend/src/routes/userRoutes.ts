import { Router } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

import { requireAdmin, requireAuth } from "../middleware/authMiddleware";

const router = Router();
const prisma = new PrismaClient();

router.use(requireAuth, requireAdmin);

router.get("/", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        name: req.body.name,
        email: req.body.email.toLowerCase().trim(),
        role: req.body.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user" });
  }
});

router.put("/:id/reset-password", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to reset password" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

export default router;