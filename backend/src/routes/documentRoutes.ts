import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

import { AuthRequest, requireAuth } from "../middleware/authMiddleware";

const router = Router();
const prisma = new PrismaClient();

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.get("/:caseId", requireAuth, async (req: AuthRequest, res) => {
  try {
    const documents = await prisma.caseDocument.findMany({
      where: {
  caseId: String(req.params.caseId),
},
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load documents" });
  }
});

router.post(
  "/upload",
  requireAuth,
  upload.single("file"),
  async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "File is required" });
      }

      const document = await prisma.caseDocument.create({
        data: {
          caseId: req.body.caseId,
          caseNumber: req.body.caseNumber,
          fileName: req.file.filename,
          originalName: req.file.originalname,
          filePath: `/uploads/${req.file.filename}`,
          fileType: req.file.mimetype,
          uploadedBy: req.body.uploadedBy || req.user?.userId || "System",
        },
      });

      res.status(201).json(document);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  }
);

export default router;