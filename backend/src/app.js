import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import connectDB from "./config/db.js";
import agentRoutes from "./routes/agentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const rootDir = path.resolve();

// Serve uploaded files
app.use(
  "/uploads",
  express.static(path.join(rootDir, "../backend/uploads"))
);

// API Routes
app.use("/api/property", propertyRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

// Serve React build
app.use(express.static(path.join(rootDir, "../client/dist")));

app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(rootDir, "../client/dist/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});