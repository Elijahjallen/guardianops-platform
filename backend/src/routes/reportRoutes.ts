import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/cases-by-status", async (_req, res) => {
  try {
    const results = await prisma.case.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    res.json(results);
  } catch (error) {
    console.error("Failed to load case status report:", error);
    res.status(500).json({ error: "Failed to load case status report" });
  }
});

router.get("/quotes-by-status", async (_req, res) => {
  try {
    const results = await prisma.case.groupBy({
      by: ["quoteStatus"],
      _count: {
        quoteStatus: true,
      },
      where: {
        quoteStatus: {
          not: null,
        },
      },
    });

    res.json(results);
  } catch (error) {
    console.error("Failed to load quote status report:", error);
    res.status(500).json({ error: "Failed to load quote status report" });
  }
});

router.get("/expenses-by-category", async (_req, res) => {
  try {
    const cases = await prisma.case.findMany({
      select: {
        flightCost: true,
        hotelCost: true,
        mealCost: true,
        groundCost: true,
        otherCost: true,
      },
    });

    const totals = {
      flightCost: 0,
      hotelCost: 0,
      mealCost: 0,
      groundCost: 0,
      otherCost: 0,
    };

    cases.forEach((caseItem) => {
      totals.flightCost += Number(caseItem.flightCost || 0);
      totals.hotelCost += Number(caseItem.hotelCost || 0);
      totals.mealCost += Number(caseItem.mealCost || 0);
      totals.groundCost += Number(caseItem.groundCost || 0);
      totals.otherCost += Number(caseItem.otherCost || 0);
    });

    res.json([
      { category: "Flight", total: totals.flightCost },
      { category: "Hotel", total: totals.hotelCost },
      { category: "Meals", total: totals.mealCost },
      { category: "Ground Transportation", total: totals.groundCost },
      { category: "Other", total: totals.otherCost },
    ]);
  } catch (error) {
    console.error("Failed to load expense category report:", error);
    res.status(500).json({ error: "Failed to load expense category report" });
  }
});

router.get("/revenue-by-month", async (_req, res) => {
  try {
    const approvedCases = await prisma.case.findMany({
      where: {
        quoteStatus: "Approved",
        quoteApprovedDate: {
          not: null,
        },
      },
      select: {
        quoteAmount: true,
        quoteApprovedDate: true,
      },
    });

    const monthlyRevenue: Record<string, number> = {};

    approvedCases.forEach((caseItem) => {
      if (!caseItem.quoteApprovedDate) return;

      const date = new Date(caseItem.quoteApprovedDate);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      monthlyRevenue[monthKey] =
        (monthlyRevenue[monthKey] || 0) + Number(caseItem.quoteAmount || 0);
    });

    const results = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue,
    }));

    res.json(results);
  } catch (error) {
    console.error("Failed to load revenue by month report:", error);
    res.status(500).json({ error: "Failed to load revenue by month report" });
  }
});

router.get("/staff-utilization", async (_req, res) => {
  try {
    const staff = await prisma.staff.findMany({
      where: {
        role: {
          in: ["Field Transport Specialist", "Case Manager"],
        },
      },
      select: {
        employeeId: true,
        name: true,
        role: true,
        status: true,
        homeAirport: true,
      },
      orderBy: {
        employeeId: "asc",
      },
    });

    const utilization = await Promise.all(
      staff.map(async (member) => {
        const assignedCases = await prisma.case.count({
          where: {
            OR: [
              { assignedEscortId: member.employeeId },
              { staffName: member.name },
              { assignedFieldStaff: member.name },
              { assignedCaseManager: member.name },
            ],
          },
        });

        return {
          employeeId: member.employeeId,
          staffName: member.name,
          role: member.role,
          status: member.status,
          homeAirport: member.homeAirport,
          assignedCases,
        };
      })
    );

    res.json(utilization);
  } catch (error) {
    console.error("Failed to load staff utilization report:", error);
    res.status(500).json({ error: "Failed to load staff utilization report" });
  }
});

router.get("/executive-summary", async (_req, res) => {
  try {
    const cases = await prisma.case.findMany({
      select: {
        quoteAmount: true,
        quoteStatus: true,
        totalExpense: true,
      },
    });

    const totalCases = cases.length;

    const approvedCases = cases.filter(
      (caseItem) => caseItem.quoteStatus === "Approved"
    );

    const sentOrApprovedCases = cases.filter(
      (caseItem) =>
        caseItem.quoteStatus === "Sent" || caseItem.quoteStatus === "Approved"
    );

    const approvedRevenue = approvedCases.reduce(
      (total, caseItem) => total + Number(caseItem.quoteAmount || 0),
      0
    );

    const revenuePipeline = sentOrApprovedCases.reduce(
      (total, caseItem) => total + Number(caseItem.quoteAmount || 0),
      0
    );

    const totalExpenses = cases.reduce(
      (total, caseItem) => total + Number(caseItem.totalExpense || 0),
      0
    );

    const projectedProfit = approvedRevenue - totalExpenses;

    const quoteConversionRate =
      sentOrApprovedCases.length > 0
        ? Math.round((approvedCases.length / sentOrApprovedCases.length) * 100)
        : 0;

    res.json({
      totalCases,
      approvedRevenue,
      revenuePipeline,
      totalExpenses,
      projectedProfit,
      quoteConversionRate,
      approvedQuotes: approvedCases.length,
      sentOrApprovedQuotes: sentOrApprovedCases.length,
    });
  } catch (error) {
    console.error("Failed to load executive summary:", error);
    res.status(500).json({ error: "Failed to load executive summary" });
  }
});

export default router;