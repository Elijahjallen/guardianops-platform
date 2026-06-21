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
      pendingQuotes,
      draftedQuotes,
      sentQuotes,
      approvedQuotes,
      declinedQuotes,
      revenuePipeline,
      approvedRevenue,
      totalRevenue,
      totalExpenses,
      averageCaseValue,
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

      prisma.case.count({
        where: {
          quoteStatus: "Pending",
        },
      }),

      prisma.case.count({
        where: {
          quoteStatus: "Drafted",
        },
      }),

      prisma.case.count({
        where: {
          quoteStatus: "Sent",
        },
      }),

      prisma.case.count({
        where: {
          quoteStatus: "Approved",
        },
      }),

      prisma.case.count({
        where: {
          quoteStatus: "Declined",
        },
      }),

      prisma.case.aggregate({
        _sum: {
          quoteAmount: true,
        },
        where: {
          quoteStatus: {
            in: ["Sent", "Approved"],
          },
        },
      }),

      prisma.case.aggregate({
        _sum: {
          quoteAmount: true,
        },
        where: {
          quoteStatus: "Approved",
        },
      }),

      prisma.case.aggregate({
        _sum: {
          quoteAmount: true,
        },
      }),

      prisma.case.aggregate({
        _sum: {
          totalExpense: true,
        },
      }),

      prisma.case.aggregate({
        _avg: {
          quoteAmount: true,
        },
      }),
    ]);

    const totalRevenueAmount = totalRevenue._sum.quoteAmount || 0;
    const totalExpenseAmount = totalExpenses._sum.totalExpense || 0;
    const projectedProfit = totalRevenueAmount - totalExpenseAmount;

    res.json({
      totalCases,
      totalClients,
      totalStaff,
      totalNotifications,
      pendingCases,
      completedCases,
      activeStaff,
      upcomingPickups,

      pendingQuotes,
      draftedQuotes,
      sentQuotes,
      approvedQuotes,
      declinedQuotes,

      revenuePipeline: revenuePipeline._sum.quoteAmount || 0,
      approvedRevenue: approvedRevenue._sum.quoteAmount || 0,
      totalRevenue: totalRevenueAmount,
      totalExpenses: totalExpenseAmount,
      projectedProfit,
      averageCaseValue: averageCaseValue._avg.quoteAmount || 0,
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