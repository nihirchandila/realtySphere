import express from "express";
import {
  submitContact,
  getAllContacts,
  markContactRead,
  deleteContact,
} from "../controllers/contactControllers.js";
import { protectAdmin } from "../middlewares/adminAuthMiddleware.js";

const router = express.Router();

router.post("/", submitContact);                           
router.get("/", protectAdmin, getAllContacts);             
router.put("/:id/read", protectAdmin, markContactRead);   
router.delete("/:id", protectAdmin, deleteContact);       

export default router;  