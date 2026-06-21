import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

async function generateNextEmployeeId() {
  const staffMembers = await prisma.staff.findMany({
    select: {
      employeeId: true,
    },
  });

  const usedNumbers = staffMembers
    .map((staff) => staff.employeeId)
    .filter((employeeId) => employeeId?.startsWith("EMP-"))
    .map((employeeId) => Number(employeeId.replace("EMP-", "")))
    .filter((number) => !Number.isNaN(number));

  const highestNumber =
    usedNumbers.length > 0 ? Math.max(...usedNumbers) : 0;

  const nextNumber = highestNumber + 1;

  return `EMP-${String(nextNumber).padStart(3, "0")}`;
}

router.get("/", async (_req, res) => {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: {
        employeeId: "asc",
      },
    });

    res.json(staff);
  } catch (error) {
    console.error("Failed to fetch staff:", error);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const staff = await prisma.staff.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!staff) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    res.json(staff);
  } catch (error) {
    console.error("Failed to fetch staff member:", error);
    res.status(500).json({ error: "Failed to fetch staff member" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, role, status, phone, email, homeAirport } = req.body;

    if (!name || !role || !status || !phone || !email || !homeAirport) {
      return res.status(400).json({
        error:
          "Name, role, status, phone, email, and home airport are required.",
      });
    }

    const existingStaff = await prisma.staff.findFirst({
      where: {
        email,
      },
    });

    if (existingStaff) {
      return res.status(400).json({
        error: "A staff member with this email already exists.",
      });
    }

    const employeeId = await generateNextEmployeeId();

    const newStaff = await prisma.staff.create({
      data: {
        employeeId,
        name,
        role,
        status,
        phone,
        email,
        homeAirport,
      },
    });

    res.status(201).json(newStaff);
  } catch (error) {
    console.error("Failed to create staff member:", error);
    res.status(500).json({ error: "Failed to create staff member" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, role, status, phone, email, homeAirport } = req.body;

    const updatedStaff = await prisma.staff.update({
      where: {
        id: req.params.id,
      },
      data: {
        name,
        role,
        status,
        phone,
        email,
        homeAirport,
      },
    });

    res.json(updatedStaff);
  } catch (error) {
    console.error("Failed to update staff member:", error);
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
    console.error("Failed to delete staff member:", error);
    res.status(500).json({ error: "Failed to delete staff member" });
  }
});

export default router;