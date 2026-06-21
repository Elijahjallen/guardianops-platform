import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("Password123!", 10);

  await prisma.user.upsert({
    where: { email: "elijahjallen@gmail.com" },
    update: {
      name: "Eli Allen",
      role: "Admin",
      password: adminPassword,
      clientName: null,
    },
    create: {
      name: "Eli Allen",
      email: "elijahjallen@gmail.com",
      password: adminPassword,
      role: "Admin",
      clientName: null,
    },
  });

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
      {
        clientCode: "CL-003",
        name: "Mountain View Behavioral Health",
        type: "Treatment Center",
        contact: "Angela Brooks",
        phone: "(602) 555-0177",
        email: "abrooks@mvbh.org",
        location: "Phoenix, AZ",
      },
      {
        clientCode: "CL-004",
        name: "Northwest Family Services",
        type: "Family Services",
        contact: "David Kim",
        phone: "(503) 555-0112",
        email: "dkim@nwfamily.org",
        location: "Portland, OR",
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
    {
      employeeId: "EMP-003",
      name: "Amanda Reed",
      role: "Field Transport Specialist",
      status: "Available",
      phone: "(208) 555-3333",
      email: "amanda@guardianops.com",
      homeAirport: "SLC",
    },
    {
      employeeId: "EMP-004",
      name: "Jason Lee",
      role: "Field Transport Specialist",
      status: "Unavailable",
      phone: "(208) 555-4444",
      email: "jason@guardianops.com",
      homeAirport: "SEA",
    },
    {
      employeeId: "EMP-005",
      name: "Rachel Morgan",
      role: "Field Transport Specialist",
      status: "Available",
      phone: "(208) 555-5551",
      email: "rachel@guardianops.com",
      homeAirport: "DEN",
    },
    {
      employeeId: "EMP-006",
      name: "Chris Walker",
      role: "Field Transport Specialist",
      status: "Available",
      phone: "(208) 555-5552",
      email: "chris@guardianops.com",
      homeAirport: "DFW",
    },
    {
      employeeId: "EMP-007",
      name: "Lauren Hayes",
      role: "Field Transport Specialist",
      status: "En Route",
      phone: "(208) 555-5553",
      email: "lauren@guardianops.com",
      homeAirport: "LAS",
    },
    {
      employeeId: "EMP-008",
      name: "Brandon Scott",
      role: "Field Transport Specialist",
      status: "Available",
      phone: "(208) 555-5554",
      email: "brandon@guardianops.com",
      homeAirport: "PDX",
    },
    {
      employeeId: "EMP-009",
      name: "Emily Foster",
      role: "Field Transport Specialist",
      status: "Unavailable",
      phone: "(208) 555-5555",
      email: "emily@guardianops.com",
      homeAirport: "SAN",
    },
    {
      employeeId: "EMP-010",
      name: "Marcus Bennett",
      role: "Field Transport Specialist",
      status: "Available",
      phone: "(208) 555-5556",
      email: "marcus@guardianops.com",
      homeAirport: "ATL",
    },
    {
      employeeId: "EMP-011",
      name: "Nicole Ramirez",
      role: "Case Manager",
      status: "Available",
      phone: "(208) 555-6661",
      email: "nicole@guardianops.com",
      homeAirport: "BOI",
    },
    {
      employeeId: "EMP-012",
      name: "Daniel Brooks",
      role: "Case Manager",
      status: "Available",
      phone: "(208) 555-6662",
      email: "daniel@guardianops.com",
      homeAirport: "PHX",
    },
    {
      employeeId: "EMP-013",
      name: "Heather Collins",
      role: "Case Manager",
      status: "Available",
      phone: "(208) 555-6663",
      email: "heather@guardianops.com",
      homeAirport: "SLC",
    },
    {
      employeeId: "EMP-014",
      name: "Kevin Parker",
      role: "Case Manager",
      status: "Unavailable",
      phone: "(208) 555-6664",
      email: "kevin@guardianops.com",
      homeAirport: "SEA",
    },
    {
      employeeId: "EMP-015",
      name: "Tiffany Grant",
      role: "Case Manager",
      status: "Available",
      phone: "(208) 555-6665",
      email: "tiffany@guardianops.com",
      homeAirport: "DEN",
    },
  ],
  skipDuplicates: true,
});

  const clients = [
    "Orange County Schools",
    "Safe Harbor Agency",
    "Mountain View Behavioral Health",
    "Northwest Family Services",
  ];

  const statuses = [
    "Pending Review",
    "Scheduling Pending",
    "Scheduled",
    "Travel Booked",
    "Ready For Transport",
    "En Route",
    "Completed",
  ];

  const quoteStatuses = ["Pending", "Drafted", "Sent", "Approved", "Declined"];

  const schedulingStatuses = [
    "Not Scheduled",
    "Scheduling Pending",
    "Scheduled",
    "Travel Booked",
    "Ready For Transport",
    "En Route",
    "Completed",
  ];

  const destinations = [
    "Phoenix, AZ",
    "Dallas, TX",
    "Denver, CO",
    "Seattle, WA",
    "Boise, ID",
    "Salt Lake City, UT",
    "Portland, OR",
    "Las Vegas, NV",
    "San Diego, CA",
    "Spokane, WA",
  ];

  const staffNames = [
    "Sarah Johnson",
    "Michael Carter",
    "Amanda Reed",
    "Jason Lee",
  ];

  const escortIds = ["EMP-001", "EMP-002", "EMP-003", "EMP-004"];

  const airlines = ["Southwest", "Delta", "United", "American Airlines", "Alaska"];

  const hotels = [
    "Hilton Garden Inn",
    "Hampton Inn",
    "Marriott Courtyard",
    "Hyatt Place",
    "Holiday Inn Express",
  ];

  const rentalCompanies = ["Enterprise", "Hertz", "Avis", "Budget", "National"];

  const cases = [];

  for (let i = 1; i <= 60; i++) {
    const quoteStatus = quoteStatuses[i % quoteStatuses.length];

    const quoteAmount = 2500 + i * 175;
    const flightCost = 300 + (i % 7) * 85;
    const hotelCost = 180 + (i % 5) * 95;
    const mealCost = 75 + (i % 4) * 40;
    const groundCost = 90 + (i % 6) * 35;
    const otherCost = 25 + (i % 3) * 50;
    const totalExpense =
      flightCost + hotelCost + mealCost + groundCost + otherCost;

    const pickupDate = new Date("2026-06-01");
    pickupDate.setDate(pickupDate.getDate() + i);

    const quoteSentDate = new Date(pickupDate);
    quoteSentDate.setDate(quoteSentDate.getDate() - 10);

    const quoteApprovedDate =
      quoteStatus === "Approved"
        ? new Date(quoteSentDate.getTime() + 3 * 24 * 60 * 60 * 1000)
        : null;

    const flightDeparture = new Date(pickupDate);
    flightDeparture.setHours(8 + (i % 8), 30, 0, 0);

    const flightArrival = new Date(flightDeparture);
    flightArrival.setHours(flightArrival.getHours() + 3);

    const hotelCheckIn = new Date(pickupDate);
    hotelCheckIn.setHours(15, 0, 0, 0);

    const hotelCheckOut = new Date(pickupDate);
    hotelCheckOut.setDate(hotelCheckOut.getDate() + 1);
    hotelCheckOut.setHours(11, 0, 0, 0);

    cases.push({
      caseNumber: `CASE-${1000 + i}`,
      clientName: clients[i % clients.length],
      status: statuses[i % statuses.length],
      destination: destinations[i % destinations.length],
      pickupDate,
      staffName: staffNames[i % staffNames.length],

      assignedCaseManager: "Nicole Ramirez",
      assignedFieldStaff: staffNames[i % staffNames.length],
      assignedEscortId: escortIds[i % escortIds.length],

      transportDate: pickupDate,
      pickupLocation: `${100 + i} Main Street`,
      destinationLocation: destinations[i % destinations.length],
      travelBooked: i % 3 !== 0,
      casePriority: i % 5 === 0 ? "High" : i % 2 === 0 ? "Medium" : "Low",

      quoteAmount,
      quoteStatus,
      quoteSentDate,
      quoteApprovedDate,

      scheduledPickupTime: pickupDate,
      scheduledDropoffTime: new Date(pickupDate.getTime() + 6 * 60 * 60 * 1000),
      departureAirport: i % 2 === 0 ? "BOI" : "SNA",
      arrivalAirport: i % 3 === 0 ? "PHX" : "DEN",
      schedulingStatus: schedulingStatuses[i % schedulingStatuses.length],

      airlineName: airlines[i % airlines.length],
      flightNumber: `GO${2000 + i}`,
      flightDeparture,
      flightArrival,

      hotelName: hotels[i % hotels.length],
      hotelCheckIn,
      hotelCheckOut,

      rentalCarCompany: rentalCompanies[i % rentalCompanies.length],
      rentalConfirmation: `RC-${7000 + i}`,

      flightConfirmation: `FL-${5000 + i}`,
      hotelConfirmation: `HT-${6000 + i}`,

      flightCost,
      hotelCost,
      mealCost,
      groundCost,
      otherCost,
      totalExpense,
    });
  }

  await prisma.case.createMany({
    data: cases,
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
      {
        title: "Quote Approved",
        message: "A parent has approved a transport quote.",
        severity: "Success",
      },
      {
        title: "Travel Booking Needed",
        message: "A scheduled case is missing travel booking details.",
        severity: "Warning",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Database seeded successfully.");
  console.log("Admin login:");
  console.log("Email: elijahjallen@gmail.com");
  console.log("Password: Password123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });