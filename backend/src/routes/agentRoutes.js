import express from "express";
import {
  registerAgent,
  loginAgent,
  updatePassword,
  getAllAgents,
  getSingleAgent,
  updateAgent,
  deleteAgent,
  getAgentProfile
} from "../controllers/agentController.js";

import { protect } from "../middlewares/agentAuthMiddleware.js";

const router = express.Router();
router.post("/register", registerAgent);
router.post("/login", loginAgent);

router.get("/profile", protect, getAgentProfile);

router.put("/update-password", protect, updatePassword);

router.get("/", protect, getAllAgents);
router.get("/:id", protect, getSingleAgent);  

router.put("/:id", protect, updateAgent);
router.delete("/:id", protect, deleteAgent);


export default router;