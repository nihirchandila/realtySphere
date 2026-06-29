import express from "express";
import {
  loginAdmin,
  // updateAdminPassword,
  getAdminProfile,
} from "../controllers/adminController.js";

import { protectAdmin } from "../middlewares/adminAuthMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);

// router.put("/update-password", updateAdminPassword);

router.get("/profile", protectAdmin, getAdminProfile);

export default router;