import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (_req, res) => {
  try {
    const [
      totalCases,
      totalClients,
      totalStaff,
      totalNotifications,
      pendingCases,
      completedCases,
      activeStaff,
      upcomingPickups,
    ] = await Promise.all([
      prisma.case.count(),
      prisma.client.count(),
      prisma.staff.count(),
      prisma.notification.count(),
      prisma.case.count({
        where: {
          status: "Pending",
        },
      }),
      prisma.case.count({
        where: {
          status: "Completed",
        },
      }),
      prisma.staff.count({
        where: {
          status: {
            in: ["Available", "En Route"],
          },
        },
      }),
      prisma.case.count({
        where: {
          pickupDate: {
            gte: new Date(),
          },
        },
      }),
    ]);

    res.json({
      totalCases,
      totalClients,
      totalStaff,
      totalNotifications,
      pendingCases,
      completedCases,
      activeStaff,
      upcomingPickups,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load dashboard data",
    });
  }
});

router.get("/case-status", async (_req, res) => {
  try {
    const statusCounts = await prisma.case.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
      orderBy: {
        _count: {
          status: "desc",
        },
      },
    });

    const formattedStatusCounts = statusCounts.map((item) => ({
      status: item.status,
      count: item._count.status,
    }));

    res.json(formattedStatusCounts);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load case status data",
    });
  }
});

export default router;