import express from "express";
import { protectAdmin } from "../middlewares/adminAuthMiddleware.js";

import {
  addProperty,
  getAllProperties,
  getSingleProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  getMyProperties ,
  getLatestProperties,
} from "../controllers/propertyController.js";

import { protect } from "../middlewares/agentAuthMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.array("images", 10),
  addProperty
);
router.get("/my", protect, getMyProperties);

// admin only
router.put("/:id/status", protectAdmin, updatePropertyStatus);


router.get("/", getAllProperties);
router.get("/latest", getLatestProperties);

router.get("/:id", getSingleProperty);

router.put(
  "/:id",
  protect,
  upload.array("images", 10),
  updateProperty
);

router.delete("/:id", protect, deleteProperty);

export default router;