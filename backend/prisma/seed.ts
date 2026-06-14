import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.client.createMany({
    data: [
      {
        clientCode: "CL-001",
        name: "Orange County Schools",
        type: "School District",
        contact: "Rebecca Adams",
        phone: "(714) 555-0192",
        email: "rebecca.adams@ocs.org",
        location: "Orange County, CA",
      },
      {
        clientCode: "CL-002",
        name: "Safe Harbor Agency",
        type: "Youth Services",
        contact: "Thomas Miller",
        phone: "(208) 555-0138",
        email: "tmiller@safeharbor.org",
        location: "Boise, ID",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.staff.createMany({
    data: [
      {
        employeeId: "EMP-001",
        name: "Sarah Johnson",
        role: "Field Transport Specialist",
        status: "Available",
        phone: "(208) 555-1111",
        email: "sarah@guardianops.com",
        homeAirport: "BOI",
      },
      {
        employeeId: "EMP-002",
        name: "Michael Carter",
        role: "Field Transport Specialist",
        status: "En Route",
        phone: "(208) 555-2222",
        email: "michael@guardianops.com",
        homeAirport: "PHX",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.case.createMany({
    data: [
      {
        caseNumber: "CASE-1001",
        clientName: "Orange County Schools",
        status: "Scheduled",
        destination: "Phoenix, AZ",
        pickupDate: new Date("2026-06-20"),
        staffName: "Sarah Johnson",
      },
      {
        caseNumber: "CASE-1002",
        clientName: "Safe Harbor Agency",
        status: "In Transit",
        destination: "Boise, ID",
        pickupDate: new Date("2026-06-22"),
        staffName: "Michael Carter",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.notification.createMany({
    data: [
      {
        title: "New Transport Request",
        message: "New youth transport request submitted.",
        severity: "Info",
      },
      {
        title: "Case Escalation",
        message: "Urgent transport case requires review.",
        severity: "High",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });