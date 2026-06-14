import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import caseRoutes from "./routes/caseRoutes";
import staffRoutes from "./routes/staffRoutes";
import clientRoutes from "./routes/clientRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/api/cases", caseRoutes);

app.use("/api/staff", staffRoutes);

app.use("/api/clients", clientRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

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