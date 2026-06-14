import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (_req, res) => {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(staff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const staffMember = await prisma.staff.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!staffMember) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    res.json(staffMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch staff member" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newStaff = await prisma.staff.create({
      data: {
        employeeId: req.body.employeeId,
        name: req.body.name,
        role: req.body.role,
        status: req.body.status,
        phone: req.body.phone,
        email: req.body.email,
        homeAirport: req.body.homeAirport,
      },
    });

    res.status(201).json(newStaff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create staff member" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedStaff = await prisma.staff.update({
      where: {
        id: req.params.id,
      },
      data: {
        employeeId: req.body.employeeId,
        name: req.body.name,
        role: req.body.role,
        status: req.body.status,
        phone: req.body.phone,
        email: req.body.email,
        homeAirport: req.body.homeAirport,
      },
    });

    res.json(updatedStaff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update staff member" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.staff.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({ message: "Staff member deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete staff member" });
  }
});

export default router;