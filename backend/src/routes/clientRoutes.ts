import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (_req, res) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const client = await prisma.client.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch client" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newClient = await prisma.client.create({
      data: {
        clientCode: req.body.clientCode,
        name: req.body.name,
        type: req.body.type,
        contact: req.body.contact,
        phone: req.body.phone,
        email: req.body.email,
        location: req.body.location,
      },
    });

    res.status(201).json(newClient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create client" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedClient = await prisma.client.update({
      where: {
        id: req.params.id,
      },
      data: {
        clientCode: req.body.clientCode,
        name: req.body.name,
        type: req.body.type,
        contact: req.body.contact,
        phone: req.body.phone,
        email: req.body.email,
        location: req.body.location,
      },
    });

    res.json(updatedClient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update client" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.client.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete client" });
  }
});

export default router;