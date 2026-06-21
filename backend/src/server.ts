import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import caseRoutes from "./routes/caseRoutes";
import staffRoutes from "./routes/staffRoutes";
import clientRoutes from "./routes/clientRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import parentRoutes from "./routes/parentRoutes";
import caseActivityRoutes from "./routes/caseActivityRoutes";
import messageRoutes from "./routes/messageRoutes";
import path from "path";
import documentRoutes from "./routes/documentRoutes";
import intakeRoutes from "./routes/intakeRoutes";
import auditRoutes from "./routes/auditRoutes";
import reportRoutes from "./routes/reportRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/cases", caseRoutes);

app.use("/api/staff", staffRoutes);

app.use("/api/clients", clientRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/parent", parentRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/case-activities", caseActivityRoutes);

app.use("/api/audit-logs", auditRoutes);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/documents", documentRoutes);

app.use("/api/intake", intakeRoutes);

app.use("/api/reports", reportRoutes);

app.get("/", (_req, res) => {
  res.send("GuardianOps API Running");
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "GuardianOps API",
    timestamp: new Date(),
  });
});

app.listen(PORT, () => {
  console.log(`GuardianOps API running on port ${PORT}`);
});